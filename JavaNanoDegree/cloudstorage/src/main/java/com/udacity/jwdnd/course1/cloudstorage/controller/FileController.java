package com.udacity.jwdnd.course1.cloudstorage.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.udacity.jwdnd.course1.cloudstorage.models.File;
import com.udacity.jwdnd.course1.cloudstorage.models.User;
import com.udacity.jwdnd.course1.cloudstorage.services.FileService;
import com.udacity.jwdnd.course1.cloudstorage.services.UserService;

@Controller
@RequestMapping("/home/file")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    private final FileService fileService;
    private final UserService userService;

    public FileController(FileService fileService, UserService userService) {
        this.fileService = fileService;
        this.userService = userService;
    }


    @PostMapping("/upload")
    public String uploadFile(   @RequestParam("fileUpload") MultipartFile fileUpload,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes) throws IOException{

        String msg;
        User user = userService.GetUser(authentication.getName());
        // InputStream fis = fileUpload.getInputStream();

        // Check file is empty
        if (fileUpload.isEmpty()) {
            msg = "File is empty! Please select a non-empty file.";
            log.error(msg);
            redirectAttributes.addFlashAttribute("errorMessage", msg);
            return "redirect:/result?error";
        }

        // Check the file type
        String contentType = fileUpload.getContentType();
        if (contentType == null || !isValidContentType(contentType)) {
            msg = "Invalid file type! " + contentType;
            log.error(msg);
            redirectAttributes.addFlashAttribute("errorMessage", msg);
            return "redirect:/result?error";
        }

        // // Check the file size
        // // Maximum file size (e.g., 10MB) from application.properties
        // final long MAX_FILE_SIZE = 10 * 1024 * 1024;
        // if (fileUpload.getSize() > MAX_FILE_SIZE) {
        //     String errorMsg = "File is too large! Maximum size is 10MB.";
        //     log.error(errorMsg);
        //     redirectAttributes.addFlashAttribute("errorMessage", errorMsg);
        //     return "redirect:/result?error";
        // }

        if (!fileService.isFileAvailable(fileUpload.getOriginalFilename(), user.getId())) {
            msg = "File already exists";
            log.error(msg);
            redirectAttributes.addFlashAttribute("errorMessage", msg);
            return "redirect:/result?error";
        }

        File file = new File();
        file.setFileName(fileUpload.getOriginalFilename());
        file.setFileSize(fileUpload.getSize() + "");
        file.setContentType(fileUpload.getContentType());
        file.setFileData(fileUpload.getBytes());
        file.setUserId(user.getId());

        fileService.CreateFile(file);
        msg = "File uploaded successfully!";
        log.info(msg);
        redirectAttributes.addFlashAttribute("successMessage", msg);

        // return "redirect:/home";
        return "redirect:/result?success";
    }


    @GetMapping("/delete/{id}")
    public String deleteFile(   @PathVariable(name="id") Integer fileId,
                                Authentication authentication,
                                RedirectAttributes redirectAttributes){
        String msg;
        log.info("Trying to delete file with id '{}'", fileId);

        // Check if file exists and is owned by the user
        User user = userService.GetUser(authentication.getName());
        Optional<File> fileOptional = Optional.ofNullable(fileService.findByIdAndUserId(fileId, user.getId()));

        if (fileOptional.isEmpty()) {
            log.error("File with ID '{}' not found for user '{}' or access denied", fileId, user.getId());
        }

        fileService.DeleteFile(fileId);
        msg = "File deleted successfully!";
        log.info(msg);
        redirectAttributes.addFlashAttribute("successMessage", msg);
        
        // redirectAttributes.addFlashAttribute("tab", "nav-files-tab");
        // return "redirect:/home?tab=files";
        // return "redirect:/home";
        return "redirect:/result?success";
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable(name="id") Integer fileId){
        try {
                log.info("Trying to download file with id '{}'", fileId);

                // Retrieve the file record from the database
                Optional<File> fileOptional = Optional.ofNullable(fileService.GetFile(fileId));

                if (!fileOptional.isPresent()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }

                File file = fileOptional.get();
                ByteArrayResource resource = new ByteArrayResource(file.getFileData());

                log.info("Downloading file '{}' with size '{}'", file.getFileName(), FileUtils.byteCountToDisplaySize(file.getFileData().length));

                // Set headers for content disposition and file name
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+ file.getFileName()+"\"")
                        .header(HttpHeaders.CONTENT_TYPE, file.getContentType())
                        .contentLength(file.getFileData().length)
                        .body(resource); 

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private boolean isValidContentType(String contentType) {
        List<String> allowedContentTypes = Arrays.asList(
            "image/jpeg",
            "application/pdf",
            "application/zip",
            "text/plain"
            );
        // return allowedContentTypes.contains(contentType);
        return true;
    }
}

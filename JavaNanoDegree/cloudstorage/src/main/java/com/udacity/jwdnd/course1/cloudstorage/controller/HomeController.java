package com.udacity.jwdnd.course1.cloudstorage.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import com.udacity.jwdnd.course1.cloudstorage.models.User;
import com.udacity.jwdnd.course1.cloudstorage.security.EncryptionService;
import com.udacity.jwdnd.course1.cloudstorage.services.UserService;

import com.udacity.jwdnd.course1.cloudstorage.models.Credentials;
import com.udacity.jwdnd.course1.cloudstorage.models.CredentialsForm;
import com.udacity.jwdnd.course1.cloudstorage.models.File;
import com.udacity.jwdnd.course1.cloudstorage.models.Note;
import com.udacity.jwdnd.course1.cloudstorage.models.NoteForm;

import com.udacity.jwdnd.course1.cloudstorage.services.CredentialsService;
import com.udacity.jwdnd.course1.cloudstorage.services.FileService;
import com.udacity.jwdnd.course1.cloudstorage.services.NoteService;


@Controller
@RequestMapping("/home")
public class HomeController {

    private static final Logger log = LoggerFactory.getLogger(HomeController.class);	

    private final NoteService noteService;
    private final CredentialsService credentialsService;
    private final UserService userService;
    private final EncryptionService encryptionService;
    private final FileService fileService;

    public HomeController(UserService userService, NoteService noteService, CredentialsService credentialsService, EncryptionService encryptionService, FileService fileService){
        this.userService = userService;
        this.noteService = noteService;
        this.fileService = fileService;
        this.credentialsService = credentialsService;
        this.encryptionService = encryptionService;
    }

    @GetMapping
    public String getHomePage(
                                Authentication authentication,
                                @ModelAttribute("newNote") NoteForm newNote,
                                @ModelAttribute("newCredentials") CredentialsForm newCredentials,
                                Model model
                                ) {

        User user = userService.GetUser(authentication.getName());
        if(user == null){
            return "signup";
        }

        List<Note> listOfNotes = noteService.getUserNotes(user.getId());

        List<File> listOfFiles = fileService.getAllUserFiles(user.getId());

        List<Credentials> listOfCredentials = credentialsService.getAllUserCredentials(user.getId());

        List<Credentials> listOfDecryptedCredentials = listOfCredentials.stream()
                                                                        .map(cred -> decryptPassword(cred))
                                                                        .collect(Collectors.toList());
        if(!listOfNotes.isEmpty()){
            model.addAttribute("notes", listOfNotes);    
        }

        if(!listOfDecryptedCredentials.isEmpty()){
            model.addAttribute("credentials", listOfDecryptedCredentials);
        }

        if(!listOfFiles.isEmpty()){
            log.info("file ID {}", listOfFiles.get(0).getId().toString());
            model.addAttribute("files", listOfFiles);
        }

        return "home";
    }

    private Credentials decryptPassword(Credentials cred){
        cred.setUnencodedPassword(encryptionService.decryptValue(cred.getPassword(), cred.getKey()));
        return cred;
    }
}

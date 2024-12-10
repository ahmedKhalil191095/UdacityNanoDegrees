package com.udacity.jwdnd.course1.cloudstorage.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.udacity.jwdnd.course1.cloudstorage.models.Credentials;
import com.udacity.jwdnd.course1.cloudstorage.models.CredentialsForm;
import com.udacity.jwdnd.course1.cloudstorage.models.User;
import com.udacity.jwdnd.course1.cloudstorage.services.CredentialsService;
import com.udacity.jwdnd.course1.cloudstorage.services.UserService;

@Controller
@RequestMapping("/home/credentials")
public class CredentialsController {

    private static final Logger log = LoggerFactory.getLogger(CredentialsController.class);

    private final CredentialsService credentialsService;
    private final UserService userService;

    public CredentialsController(CredentialsService credentialsService, UserService userService) {
        this.credentialsService = credentialsService;
        this.userService = userService;
    }

    @PostMapping
    public String createCredential(
                                Authentication authentication,
                                @ModelAttribute("newCredentials") CredentialsForm newCredentials,
                                RedirectAttributes redirectAttributes
                            ) 
    {
        String msg;
        User user = userService.GetUser(authentication.getName());
        log.info("Creating a credential for user '{}'", user.getUsername());

        if(user.getId() == null){
            return "redirect:/result?error";
        }
        // convertNoteFormToNote
        Credentials credentials = convertCredentialsFormToCredentials(newCredentials, user.getId());

        // Save Credentials
        if(credentials.getId() == 0 || credentials.getId() == null){
            credentialsService.createCredentials(credentials);
            msg = "Credentials created successfully";
            log.info(msg);
            log.info("Credentials: {}", credentials.toString());
            redirectAttributes.addFlashAttribute("successMessage", msg);
            return "redirect:/result?success";
        }
        else{
            credentialsService.updateCredentials(credentials);
            msg = "Credentials updated successfully";
            log.info(msg);
            log.info("Credentials: {}", credentials.toString());
            redirectAttributes.addFlashAttribute("successMessage", msg);
            return "redirect:/result?success";
        }

        //return "redirect:/result?success";
        // return "redirect:/home?tab=notes";
        // return "redirect:/home";
    }

    @GetMapping("/delete/{id}")
    public String deleteCredential( 
                                Authentication authentication,
                                @PathVariable(name = "id") String id,
                                RedirectAttributes redirectAttributes
                            ){
        String msg;
        User user = userService.GetUser(authentication.getName());
        log.info("Deleting credential id: {} for user: '{}'", id, user.getUsername());

        if(id.isBlank()){
            return "redirect:/result?error";
        }

        Integer CredId = Integer.parseInt(id);
        credentialsService.deleteCredentials(CredId);
        msg = "Credentials deleted successfully!";
        log.info(msg);
        redirectAttributes.addFlashAttribute("successMessage", msg);
        return "redirect:/result?success";
    }


    private Credentials convertCredentialsFormToCredentials(CredentialsForm CredentialsForm, Integer userId){
        Credentials credentials = new Credentials();
        if(CredentialsForm.getId().isBlank()){
            credentials.setId(0);
        }
        else {
            credentials.setId(Integer.parseInt(CredentialsForm.getId()));
        }

        credentials.setUrl(CredentialsForm.getUrl());
        credentials.setUsername(CredentialsForm.getUsername());
        credentials.setPassword(CredentialsForm.getPassword());
        credentials.setUserId(userId);

        return credentials;
    }

}

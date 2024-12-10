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

import com.udacity.jwdnd.course1.cloudstorage.models.Note;
import com.udacity.jwdnd.course1.cloudstorage.models.NoteForm;
import com.udacity.jwdnd.course1.cloudstorage.models.User;
import com.udacity.jwdnd.course1.cloudstorage.services.NoteService;
import com.udacity.jwdnd.course1.cloudstorage.services.UserService;


@Controller
@RequestMapping("/home/note")
public class NoteController {

    private static final Logger log = LoggerFactory.getLogger(NoteController.class);

    private final NoteService noteService;
    private final UserService userService;

    public NoteController(NoteService noteService, UserService userService) {
        this.noteService = noteService;
        this.userService = userService;
    }

    @PostMapping
    public String CreateNote(
                                Authentication authentication,
                                @ModelAttribute("newNote") NoteForm newNote,
                                RedirectAttributes redirectAttributes){

        
        String msg;
        User user = userService.GetUser(authentication.getName());
        log.info("Creating note for user '{}'", user.getUsername());

        if(user.getId() == null){
            return "redirect:/result?error";
        }

        // convertNoteFormToNote
        Note note = convertNoteFormToNote(newNote, user.getId());

        // Save Note
        if(note.getId() == 0 || note.getId() == null){
            noteService.CreateNote(note);
            msg = "Note created successfully";
            log.info(msg);
            log.info("Note: {}", note.toString());
            redirectAttributes.addFlashAttribute("successMessage", msg);
            return "redirect:/result?success";
        }
        else{
            noteService.UpdateNote(note);
            msg = "Note updated successfully";
            log.info(msg);
            log.info("Note: {}", note.toString());
            redirectAttributes.addFlashAttribute("successMessage", msg);
            return "redirect:/result?success";
        }

    }

    @GetMapping("/delete/{id}")
    public String DeleteNote( 
                                Authentication authentication,
                                @PathVariable(name = "id") String id,
                                RedirectAttributes redirectAttributes
                            ){

        String msg;
        User user = userService.GetUser(authentication.getName());
        log.info("Deleting note id: {} for user: '{}'", id, user.getUsername());

        if(id.isBlank()){
            return "redirect:/result?error";
        }

        Integer NoteId = Integer.valueOf(id);
        noteService.DeleteNote(NoteId);
        msg = "Note deleted successfully";
        log.info(msg);
        redirectAttributes.addFlashAttribute("successMessage", msg);

        return "redirect:/result?success";

    }

    private Note convertNoteFormToNote(NoteForm noteForm, Integer userId){
        Note note = new Note();
        if(noteForm.getId().isBlank()){
            note.setId(0);
        }
        else {
            note.setId(Integer.valueOf(noteForm.getId()));
        }

        note.setTitle(noteForm.getTitle());
        note.setDescription(noteForm.getDescription());
        note.setUserId(userId);
        return note;
    }
}

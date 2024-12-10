package com.udacity.jwdnd.course1.cloudstorage.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.udacity.jwdnd.course1.cloudstorage.mapper.NoteMapper;
import com.udacity.jwdnd.course1.cloudstorage.models.Note;

@Service
public class NoteService {

    private final NoteMapper noteMapper;

    public NoteService(NoteMapper noteMapper ) {
        this.noteMapper = noteMapper;
    }

    public Integer CreateNote(Note note){
        return noteMapper.insert(note);
    }

    public void UpdateNote(Note note){
        noteMapper.update(note);
    }

    public void DeleteNote(Integer noteId){
        noteMapper.delete(noteId);
    }

    public Note GetNote(Integer noteId){
        return noteMapper.findById(noteId);
    }

    public List<Note> getAllNotes(){
        return noteMapper.findAll();
    }
    
    public List<Note> getUserNotes(Integer userId){
        return noteMapper.findAllUserNotes(userId);
    }
}
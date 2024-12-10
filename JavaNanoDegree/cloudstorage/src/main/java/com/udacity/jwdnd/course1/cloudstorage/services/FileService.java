package com.udacity.jwdnd.course1.cloudstorage.services;


import java.util.List;

import org.springframework.stereotype.Service;

import com.udacity.jwdnd.course1.cloudstorage.mapper.FileMapper;
import com.udacity.jwdnd.course1.cloudstorage.models.File;


@Service
public class FileService {

    private final FileMapper fileMapper;

    public FileService(FileMapper fileMapper ) {
        this.fileMapper = fileMapper;
    }

    public Integer CreateFile(File file){
        return fileMapper.insert(file);
    }

    public void UpdateFile(File file){
        fileMapper.update(file);
    }

    public void DeleteFile(Integer fileId){
        fileMapper.delete(fileId);
    }

    public File GetFile(Integer fileId){
        return fileMapper.findById(fileId);
    }
    
    public List<File> getAllUserFiles(Integer userId){
        return fileMapper.findAllUserFiles(userId);
    }

    public File findByIdAndUserId(Integer fileId, Integer userId){
        return fileMapper.findByIdAndUserId(fileId, userId);
    }

    public boolean isFileAvailable(String fileName, Integer userId) {
        File file = fileMapper.findByNameAndByUserId(fileName, userId);
        return file == null;
    }
}


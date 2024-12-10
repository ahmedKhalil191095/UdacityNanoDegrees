package com.udacity.jwdnd.course1.cloudstorage.services;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Service;

import com.udacity.jwdnd.course1.cloudstorage.mapper.CredentialsMapper;
import com.udacity.jwdnd.course1.cloudstorage.models.Credentials;
import com.udacity.jwdnd.course1.cloudstorage.security.EncryptionService;

@Service
public class CredentialsService {

    private final CredentialsMapper credentialsMapper;
    private final EncryptionService encryptionService;

    public CredentialsService(CredentialsMapper credentialsMapper, EncryptionService encryptionService) {
        this.credentialsMapper = credentialsMapper;
        this.encryptionService = encryptionService;
    }

    private String generateKey() {
        SecureRandom random = new SecureRandom();
        byte[] key = new byte[16];
        random.nextBytes(key);
        String encodedKey = Base64.getEncoder().encodeToString(key);
        return encodedKey;
    }

    public Integer createCredentials(Credentials credentials){

        credentials.setKey(generateKey());
        String encryptedPassword = encryptionService.encryptValue(credentials.getPassword(), credentials.getKey());
        credentials.setPassword(encryptedPassword);

        return credentialsMapper.insert(credentials);
    }

    public void updateCredentials(Credentials credentials){
        Credentials storedCredential = credentialsMapper.findByById(credentials.getId());

        //Use the same stored key
        credentials.setKey(storedCredential.getKey());
        
        String encryptedPassword = encryptionService.encryptValue(credentials.getPassword(), credentials.getKey());
        credentials.setPassword(encryptedPassword);

        credentialsMapper.update(credentials);
    }

    public void deleteCredentials(Integer credentialsId){
        credentialsMapper.delete(credentialsId);
    }

    public List<Credentials> getAllUserCredentials(Integer credentialsId){
        return credentialsMapper.findAllUserCredentials(credentialsId);
    }
}


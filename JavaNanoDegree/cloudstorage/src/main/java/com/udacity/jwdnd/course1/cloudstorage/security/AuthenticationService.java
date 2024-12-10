package com.udacity.jwdnd.course1.cloudstorage.security;

import java.util.ArrayList;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.udacity.jwdnd.course1.cloudstorage.mapper.UserMapper;
import com.udacity.jwdnd.course1.cloudstorage.models.User;


@Service
public class AuthenticationService implements AuthenticationProvider {
    private final UserMapper userMapper;
    private final HashService hashService;

    public AuthenticationService(UserMapper userMapper, HashService hashService) {
        this.userMapper = userMapper;
        this.hashService = hashService;
    }

    @Override 
    public Authentication authenticate (Authentication authentication) throws AuthenticationException
    {   
        String username = authentication.getName();
        String password = authentication.getCredentials().toString();
        User user = userMapper.getUserByUsername(username);
        if(user != null)
        {   
            String encodedSalt = user.getSalt();
            String hashedPassword = hashService.getHashedValue(password, encodedSalt);
            if(user.getPassword().equals(hashedPassword)){
                return new UsernamePasswordAuthenticationToken(username,password, new ArrayList<>());
            }
        }
        throw new BadCredentialsException("invalid username or password");
    }
    @Override 
    public boolean supports(Class<?> authentication)
    {   
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }
}

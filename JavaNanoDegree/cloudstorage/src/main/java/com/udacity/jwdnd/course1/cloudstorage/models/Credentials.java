package com.udacity.jwdnd.course1.cloudstorage.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Credentials {
    private Integer id;
    private String url;
    private String username;
    private String key;
    private String password;
    private String unencodedPassword;
    private Integer userId;
}


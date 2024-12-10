package com.udacity.jwdnd.course1.cloudstorage.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@AllArgsConstructor

public class User {
    private Integer id;
    private String  username;
    private String  salt;
    private String  password;
    private String  firstName;
    private String  lastName;

}

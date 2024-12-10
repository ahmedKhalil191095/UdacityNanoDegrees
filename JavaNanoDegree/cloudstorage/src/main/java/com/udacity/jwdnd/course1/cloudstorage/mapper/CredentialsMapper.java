package com.udacity.jwdnd.course1.cloudstorage.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.ResultMap;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.udacity.jwdnd.course1.cloudstorage.models.Credentials;

@Mapper
public interface CredentialsMapper {
    @Select("SELECT * FROM CREDENTIALS WHERE credentialid = #{credentialId}")
    @Results(id = "CredentialsResultMap", value = {
        @Result(property = "id", column = "credentialid"),
        @Result(property = "url", column = "url"),
        @Result(property = "username", column = "username"),
        @Result(property = "key", column = "key"),
        @Result(property = "password", column = "password"),
        @Result(property = "userId", column = "userid")
    })
    Credentials findByById(Integer credentialId);

    @Select("SELECT * FROM CREDENTIALS WHERE userid= #{userId}")
    @ResultMap("CredentialsResultMap")
    List<Credentials> findAllUserCredentials(Integer userId);

    @Insert("INSERT INTO CREDENTIALS (url, username, `key`, password, userid) VALUES (#{url}, #{username}, #{key}, #{password}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insert(Credentials credentials);

    @Update("UPDATE CREDENTIALS SET url = #{url}, username = #{username}, key = #{key}, password= #{password} WHERE credentialid = #{id}")
    void update(Credentials credentials);

    @Delete("DELETE FROM CREDENTIALS WHERE credentialid = #{credentialId}")
    int delete(Integer credentialId);
}


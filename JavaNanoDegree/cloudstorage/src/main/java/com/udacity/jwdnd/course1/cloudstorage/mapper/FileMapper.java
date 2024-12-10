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

import com.udacity.jwdnd.course1.cloudstorage.models.File;

@Mapper
public interface FileMapper {

    @Select("SELECT * FROM FILES WHERE fileId = #{fileId}")
    @Results(id = "FileResultMap", value = {
        @Result(property = "id", column = "fileId"),
        @Result(property = "fileName", column = "filename"),
        @Result(property = "contentType", column = "contenttype"),
        @Result(property = "fileSize", column = "filesize"),
        @Result(property = "userId", column = "userid"),
        @Result(property = "fileData", column = "filedata")
    })
    File findById(Integer fileId);

    @Select("SELECT * FROM FILES WHERE userid = #{userId} AND filename = #{fileName}")
    @ResultMap("FileResultMap")
    File findByNameAndByUserId(String fileName, Integer userId);

    @Select("SELECT * FROM FILES WHERE fileId = #{fileId} AND userid = #{userId}")
    @ResultMap("FileResultMap")
    File findByIdAndUserId(Integer fileId, Integer userId);

    @Select("SELECT * FROM FILES WHERE userid = #{userId}")
    @ResultMap("FileResultMap")
    List<File> findAllUserFiles(Integer userId);

    @Insert("INSERT INTO FILES (filename, contenttype, filesize, userid, filedata) VALUES (#{fileName}, #{contentType}, #{fileSize}, #{userId}, #{fileData})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insert(File file);

    @Update("UPDATE FILES SET filename = #{fileName}, contenttype = #{contentType}, filesize = #{fileSize}, filedata= #{fileData} WHERE fileId = #{id}")
    void update(File file);

    @Delete("DELETE FROM FILES WHERE fileId = #{fileId}")
    int delete(Integer fileId);
}
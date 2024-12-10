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

import com.udacity.jwdnd.course1.cloudstorage.models.Note;

@Mapper
public interface NoteMapper {
    @Select("SELECT * FROM NOTES WHERE noteid = #{noteId}")
        @Results(id = "NoteResultMap", value = {
        @Result(property = "id", column = "noteid"),
        @Result(property = "title", column = "notetitle"),
        @Result(property = "description", column = "notedescription"),
        @Result(property = "userId", column = "userid")
    })
    Note findById(Integer noteId);

    @Select("SELECT * FROM NOTES WHERE userid = #{userId}")
    @ResultMap("NoteResultMap")
    List<Note> findAllUserNotes(Integer userId);

    @Select("SELECT * FROM NOTES")
    @ResultMap("NoteResultMap")
    List<Note> findAll();

    @Delete("DELETE FROM NOTES WHERE noteid = #{noteId}")
    void delete(Integer noteId);

    @Delete("DELETE FROM NOTES")
    void deleteAll();

    @Select("DELETE FROM NOTES WHERE userid = #{userId}")
    void deleteByUserId(Integer userId);

    @Insert("INSERT INTO NOTES (notetitle, notedescription, userid) VALUES(#{title}, #{description}, #{userId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    Integer insert(Note note);

    @Update("UPDATE NOTES SET notetitle = #{title}, notedescription = #{description} WHERE noteid = #{id}")
    void update(Note note);

}
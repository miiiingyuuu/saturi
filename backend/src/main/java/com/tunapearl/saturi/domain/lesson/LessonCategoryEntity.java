package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_category")
public class LessonCategoryEntity {

    @Id @GeneratedValue
    @Column(name = "lesson_category_id")
    private Long lessonCategoryId;

    private String name;
}

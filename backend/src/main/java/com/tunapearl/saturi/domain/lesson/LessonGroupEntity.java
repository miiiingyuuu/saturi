package com.tunapearl.saturi.domain.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "lesson_group")
public class LessonGroupEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_group_id")
    private Long lessonGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_category_id")
    private LessonCategoryEntity lessonCategory;
    
    private String name; // 소제목
    
    @OneToMany(mappedBy = "lessonGroup", cascade = CascadeType.ALL)
    private List<LessonEntity> lessons = new ArrayList<>();

    /**
     * 비즈니스 로직
     */
    public void setLessons(LessonEntity lesson) {
        this.lessons.add(lesson);
        lesson.setLessonGroup(this);
    }
}

package com.tunapearl.saturi.domain.lesson;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_group")
public class LessonGroupEntity {

    @Id @GeneratedValue
    @Column(name = "lesson_group_id")
    private Long lessonGroupId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_category_id")
    private LessonCategoryEntity lessonCategory;
    
    private String name; // 소제목
    
    // TODO 레슨 일대다 조회 추가
}

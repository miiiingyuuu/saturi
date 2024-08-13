package com.tunapearl.saturi.domain.lesson;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "lesson_record_graph")
public class LessonRecordGraphEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lesson_record_graph_id")
    private Long lessonRecordGraphId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_result_id")
    private LessonResultEntity lessonResult;

    @Column(name = "graph_x")
    private String graphX;

    @Column(name = "graph_y")
    private String graphY;
}

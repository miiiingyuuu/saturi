package com.tunapearl.saturi.dto.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter @Setter
@AllArgsConstructor
public class LessonGroupResultIdAndLessonId {
    private Long lessonGroupId;
    private Long lessonId;

    // equals 메서드 재정의
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LessonGroupResultIdAndLessonId lesson = (LessonGroupResultIdAndLessonId) o;
        return Objects.equals(lessonId, lesson.lessonId) &&
                Objects.equals(lessonGroupId, lesson.lessonGroupId);
    }

    // hashCode 메서드 재정의
    @Override
    public int hashCode() {
        return Objects.hash(lessonId, lessonGroupId);
    }
}

package com.tunapearl.saturi.domain.user;

import com.tunapearl.saturi.domain.LocationEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

import static jakarta.persistence.EnumType.STRING;

@Entity
@Getter @Setter
@Table(name = "user")
public class UserEntity {

    @Id @GeneratedValue
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private LocationEntity location;

    private String email;

    private String nickname;

    private String password;

    private LocalDateTime regDate;

    private Long exp;

    @Enumerated(STRING)
    private Gender gender;

    @Enumerated(STRING)
    private AgeRange ageRange;

    @Enumerated(STRING)
    private Role role;

    private LocalDateTime deletedDt;

    private Boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bird_id")
    private BirdEntity bird;

    private LocalDateTime returnDt;

    @OneToMany(mappedBy = "user")
    private List<GameRoomParticipantEntity> gameRoomParticipants;
}

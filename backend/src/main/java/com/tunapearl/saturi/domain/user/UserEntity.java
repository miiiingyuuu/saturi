package com.tunapearl.saturi.domain.user;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

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

    private String jwtToken;

    private String kToken;

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
    @JoinColumn(name = "quokka_id")
    private QuokkaEntity quokka;

    private LocalDateTime returnDt;
}

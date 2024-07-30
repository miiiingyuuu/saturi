package com.tunapearl.saturi.domain;

import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "location")
@ToString
public class LocationEntity {

    @Id @GeneratedValue
    @Column(name = "location_id")
    private Long locationId;

    private String name;

//    @OneToMany(mappedBy = "location")
//    private List<UserEntity> users = new ArrayList<>();
}

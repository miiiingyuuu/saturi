package com.tunapearl.saturi.domain.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@Table(name = "bird")
public class BirdEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bird_id")
    private Long id;

    private String name;

    private String description;

//    @OneToMany(mappedBy = "bird")
//    private List<UserEntity> users = new ArrayList<>();
}

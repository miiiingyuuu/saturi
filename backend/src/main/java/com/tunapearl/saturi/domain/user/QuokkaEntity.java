package com.tunapearl.saturi.domain.user;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class QuokkaEntity {

    @Id @GeneratedValue
    @Column(name = "quokka_id")
    private Long id;

    private String description;

    private String imagePath;

    @OneToMany(mappedBy = "quokka")
    private List<UserEntity> users = new ArrayList<>();
}

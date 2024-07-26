package com.tunapearl.saturi;

import com.tunapearl.saturi.domain.LocationEntity;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class SaturiApplication {

	public static void main(String[] args) {
		SpringApplication.run(SaturiApplication.class, args);
	}

}

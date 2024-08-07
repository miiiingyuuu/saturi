package com.tunapearl.saturi.repository;

import com.tunapearl.saturi.utils.PasswordEncoder;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
@RequiredArgsConstructor
public class SampleDataRepository {

    private final EntityManager em;

    public void insertLocations(String[] locationNames) {
        StringBuilder sb = new StringBuilder();
        sb.append("insert into location (name) values ");

        for (int i = 0; i < locationNames.length; i++) {
            sb.append("('").append(locationNames[i]).append("')");
            if(i < locationNames.length - 1) sb.append(",");
        }

        em.createNativeQuery(sb.toString()).executeUpdate();
    }

    public void insertBirds(String[] birdNames, String[] birdDescriptions) {
        StringBuilder sb = new StringBuilder();
        sb.append("insert into bird (name, description) values ");

        for (int i = 0; i < birdNames.length; i++) {
            sb.append("('").append(birdNames[i]).append("','").append(birdDescriptions[i]).append("')");
            if(i < birdNames.length - 1) sb.append(",");
        }

        em.createNativeQuery(sb.toString()).executeUpdate();
    }

    public void insertUsers() {
        StringBuilder sb = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        Object[][] userDummy = {
                {1, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1024, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 2, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 5010, "'FEMALE'", "'DEFAULT'", "'BASIC'", null, false, 4, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 512, "'DEFAULT'", "'TEENAGER'", "'BASIC'", null, false, 11, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 22, "'FEMALE'", "'CHILD'", "'BASIC'", null, false, 3, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 518, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 1, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1940, "'DEFAULT'", "'FOURTEEN'", "'BASIC'", null, false, 2, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2062, "'MALE'", "'DEFAULT'", "'BASIC'", null, false, 3, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1244, "'FEMALE'", "'TWENTEEN'", "'BASIC'", null, false, 4, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 4464, "'DEFAULT'", "'THIRTEEN'", "'BASIC'", null, false, 5, null},
                {2, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2910, "'FEMALE'", "'TEENAGER'", "'BASIC'", null, false, 6, null},
                {3, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2488, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 18, null},
                {4, "", "'내이름은", "", LocalDateTime.now().format(formatter), 4984, "'DEFAULT'", "'DEFAULT'", "'BASIC'", null, false, 11, null},
                {5, "", "'내이름은", "", LocalDateTime.now().format(formatter), 3082, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 15, null},
                {6, "", "'내이름은", "", LocalDateTime.now().format(formatter), 3820, "'FEMALE'", "'FIFTEEN'", "'BASIC'", null, false, 17, null},
                {7, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2924, "'DEFAULT'", "'TEENAGER'", "'BASIC'", null, false, 18, null},
                {3, "", "'내이름은", "", LocalDateTime.now().format(formatter), 904, "'FEMALE'", "'TWENTEEN'", "'BASIC'", null, false, 7, null},
                {4, "", "'내이름은", "", LocalDateTime.now().format(formatter), 692, "'MALE'", "'THIRTEEN'", "'BASIC'", null, false, 8, null},
                {5, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1320, "'DEFAULT'", "'DEFAULT'", "'BASIC'", null, false, 9, null},
                {6, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2716, "'MALE'", "'FOURTEEN'", "'BASIC'", null, false, 9, null},
                {7, "", "'내이름은", "", LocalDateTime.now().format(formatter), 400, "'FEMALE'", "'TWENTEEN'", "'BASIC'", null, false, 8, null},
                {3, "", "'내이름은", "", LocalDateTime.now().format(formatter), 300, "'DEFAULT'", "'CHILD'", "'BASIC'", null, false, 7, null},
                {4, "", "'내이름은", "", LocalDateTime.now().format(formatter), 422, "'FEMALE'", "'TWENTEEN'", "'BASIC'", null, false, 6, null},
                {5, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1234, "'MALE'", "'DEFAULT'", "'BASIC'", null, false, 5, null},
                {6, "", "'내이름은", "", LocalDateTime.now().format(formatter), 4444, "'DEFAULT'", "'TWENTEEN'", "'BASIC'", null, false, 13, null},
                {7, "", "'내이름은", "", LocalDateTime.now().format(formatter), 3322, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 2, null},
                {3, "", "'내이름은", "", LocalDateTime.now().format(formatter), 2210, "'FEMALE'", "'TWENTEEN'", "'BASIC'", null, false, 1, null},
                {4, "", "'내이름은", "", LocalDateTime.now().format(formatter), 1122, "'DEFAULT'", "'TEENAGER'", "'BASIC'", null, false, 5, null},
                {5, "", "'내이름은", "", LocalDateTime.now().format(formatter), 998, "'FEMALE'", "'DEFAULT'", "'BASIC'", null, false, 15, null},
                {6, "", "'내이름은", "", LocalDateTime.now().format(formatter), 124, "'MALE'", "'TWENTEEN'", "'BASIC'", null, false, 15, "'" + LocalDateTime.now().plusDays(10).format(formatter) + "'"},
                {7, "", "'내이름은", "", LocalDateTime.now().format(formatter), 136, "'DEFAULT'", "'THIRTEEN'", "'BASIC'", "'" + LocalDateTime.now().minusDays(30).format((formatter)) + "'", true, 11, null}
        };
        int dummySize = userDummy.length;
        for (int i = 0; i < dummySize; i++) {
            userDummy[i][1] = "'email" + (i+1) + "@email.com'";
            userDummy[i][2] += (i+1) + "번'";
            String password = PasswordEncoder.encrypt((String)userDummy[i][1], "password1!");
            userDummy[i][3] = "'" + password + "'";
            userDummy[i][4] = "'" + userDummy[i][4] + "'";
        }
        sb.append("insert into user (location_id, email, nickname, password, reg_date, exp, gender, age_range, role, deleted_dt, is_deleted, bird_id, return_dt) values ");
        for (int i = 0; i < dummySize; i++) {
            sb.append("(");
            for (int j = 0; j < 13; j++) {
                sb.append(userDummy[i][j]);
                if(j != 12) sb.append(",");
            }
            sb.append(")");
            if(i < dummySize - 1) sb.append(",");
        }

        em.createNativeQuery(sb.toString()).executeUpdate();
    }

}

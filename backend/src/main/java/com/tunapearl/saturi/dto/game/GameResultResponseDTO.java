package com.tunapearl.saturi.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GameResultResponseDTO {

    int rank;
    String nickName;
    //본인인가
    Long birdId;

    boolean isUser = false;
    //몇개 맞췄냐
    int ansCount;
    //얻은 경험치
    long earnedExp;
    //원래 경험치
    long exp;
}

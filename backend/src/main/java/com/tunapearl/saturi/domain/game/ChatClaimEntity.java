package com.tunapearl.saturi.domain.game;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "chat_claim")
public class ChatClaimEntity {

    @Id @GeneratedValue
    @Column(name = "chat_claim_id")
    private Long chatClaimId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_log_id")
    private GameLogEntity gameLog;

    @Column(name = "claimedDt")
    private LocalDateTime claimedDt;

    @Column(name = "is_checked")
    private boolean isChecked;

    @Column(name = "checkedDt")
    private LocalDateTime checkedDt;


    /*
     * 생성 메서드
     */
    public static ChatClaimEntity createChatClaim(GameLogEntity gameLog){
        ChatClaimEntity chatClaimEntity = new ChatClaimEntity();
        chatClaimEntity.gameLog = gameLog;
        chatClaimEntity.claimedDt = LocalDateTime.now();
        chatClaimEntity.isChecked = false;
        return chatClaimEntity;
    }

    /*
    * 비즈니스 로직
    */
    public void check() {
        this.isChecked = true;
        checkedDt = LocalDateTime.now();
    }
}

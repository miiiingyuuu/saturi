package com.tunapearl.saturi.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.tunapearl.saturi.domain.game.ChatClaimEntity;
import com.tunapearl.saturi.domain.game.QChatClaimEntity;
import com.tunapearl.saturi.domain.game.QGameLogEntity;
import com.tunapearl.saturi.domain.game.QGameRoomEntity;
import com.tunapearl.saturi.domain.quiz.QQuizEntity;
import com.tunapearl.saturi.domain.user.QUserEntity;
import com.tunapearl.saturi.dto.admin.claim.ClaimDeleteRequestDto;
import com.tunapearl.saturi.dto.admin.claim.ClaimReadRequestDto;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ChatClaimRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public void save(ChatClaimEntity chatClaimEntity) {
        em.persist(chatClaimEntity);
    }

    public List<ChatClaimEntity> findAll(ClaimReadRequestDto responseDto) {
        QChatClaimEntity qChatClaim = new QChatClaimEntity("cc");
        return queryFactory
                .selectFrom(qChatClaim)
                .join(qChatClaim.gameLog).fetchJoin()
                .join(qChatClaim.gameLog.user).fetchJoin()
                .join(qChatClaim.gameLog.room).fetchJoin()
                .join(qChatClaim.gameLog.quiz).fetchJoin()
                .where(
                        gameLogIdEq(qChatClaim.gameLog, responseDto.getGameLogId()),
                        userIdEq(qChatClaim.gameLog.user, responseDto.getUserId()),
                        roomIdEq(qChatClaim.gameLog.room, responseDto.getRoomId()),
                        quizIdEq(qChatClaim.gameLog.quiz, responseDto.getQuizId())
                )
                .limit(1000)
                .fetch();
    }

    public Optional<ChatClaimEntity> findById(Long chatClaimId) {
        return Optional.ofNullable(em.find(ChatClaimEntity.class, chatClaimId));
    }

    public void removeById(Long chatClaimId) {
        em.remove(em.find(ChatClaimEntity.class, chatClaimId));
    }

    private BooleanExpression gameLogIdEq(QGameLogEntity gameLog, Long gameLogIdCond) {
        return gameLogIdCond != null ? gameLog.gameLogId.eq(gameLogIdCond) : null;
    }

    private BooleanExpression userIdEq(QUserEntity user, Long userIdCond) {
        return userIdCond != null ? user.userId.eq(userIdCond) : null;
    }

    private BooleanExpression roomIdEq(QGameRoomEntity gameRoom, Long roomIdCond) {
        return roomIdCond != null ? gameRoom.roomId.eq(roomIdCond) : null;
    }

    private BooleanExpression quizIdEq(QQuizEntity quiz, Long quizIdCond) {
        return quizIdCond != null ? quiz.quizId.eq(quizIdCond) : null;
    }
}

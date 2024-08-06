package com.tunapearl.saturi.repository.game;

import com.tunapearl.saturi.domain.game.GameRoomParticipantEntity;
import com.tunapearl.saturi.domain.game.GameRoomParticipantId;
import com.tunapearl.saturi.domain.user.UserEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class GameRoomParticipantRepository {

    @PersistenceContext
    private final EntityManager em;

    public Optional<GameRoomParticipantEntity> findBGameRoomParticipantId(Long gameRoomParticipantId) {
        return Optional.ofNullable(em.find(GameRoomParticipantEntity.class, gameRoomParticipantId));
    }

    public void saveGameRoomParticipant(GameRoomParticipantEntity gameRoomParticipantEntity) {

        em.persist(gameRoomParticipantEntity);
    }

    public List<GameRoomParticipantEntity> findByRoomId(Long roomId) {
        return em.createQuery("select p from GameRoomParticipantEntity p where p.id.roomId = :roomId", GameRoomParticipantEntity.class)
                .setParameter("roomId", roomId)
                .getResultList();
    }

    public List<GameRoomParticipantEntity> findByRoomIdOrderByCorrectCount(Long roomId) {
        return em.createQuery("select p from GameRoomParticipantEntity p where p.id.roomId = :roomId order by correctCount desc", GameRoomParticipantEntity.class)
                .setParameter("roomId", roomId)
                .getResultList();
    }

    public GameRoomParticipantEntity findParticipantByGameRoomParticipantId(GameRoomParticipantId id) {
        return em.createQuery("select  p from GameRoomParticipantEntity p where p.gameRoom.roomId = :roomId and p.user.userId=:userId", GameRoomParticipantEntity.class)
                .setParameter("roomId", id.getRoomId())
                .setParameter("userId",id.getUserId())
                .getSingleResult();

    }
}

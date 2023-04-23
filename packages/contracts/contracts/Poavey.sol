//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Poavey {
    ISemaphore public semaphore;
    mapping(uint256 => Event) public events;

    struct Event {
        uint256 id;
        uint256 groupId;
        uint256 eventId;
        mapping(address => bool) attendees;
        mapping(uint256 => bool) nullifierHashes;
        string[] surveyOptions;
        // TODO: should be stored offchain.
        uint256[] commitments;
        uint256[] answers;
    }

    event EventRegistered(
        uint256 indexed id,
        uint256 indexed eventId,
        uint256 indexed groupId
    );
    event EventAttended(
        uint256 indexed id,
        address indexed attendee,
        uint256 indexed groupId
    );
    event SurveyAnswered(
        uint256 indexed id,
        uint256 indexed answers,
        uint256 indexed groupId
    );

    constructor(address semaphoreAddress) {
        semaphore = ISemaphore(semaphoreAddress);
    }

    function registerEvent(uint256 eventId, uint256 groupId, string[] calldata surveyOptions) external {
        if (surveyOptions.length == 0) revert("Poavey: survey options cannot be empty");

        uint256 id = uint256(
            keccak256(abi.encodePacked(msg.sender, blockhash(block.number - 1)))
        );

        Event storage anEvent = events[id];
        if (anEvent.id != 0) revert("Poavey: event already exists");
        anEvent.id = id;
        anEvent.eventId = eventId;
        anEvent.groupId = groupId;

        for(uint256 i = 0; i < surveyOptions.length; i++) {
            anEvent.surveyOptions.push(surveyOptions[i]);
        }

        semaphore.createGroup(groupId, 20, address(this));

        emit EventRegistered(id, eventId, groupId);
    }

    function attendEvent(uint256 id, uint256 identityCommitment) external {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        if (anEvent.attendees[msg.sender]) revert("Poavey: already attended");

        anEvent.attendees[msg.sender] = true;
        anEvent.commitments.push(identityCommitment);
        semaphore.addMember(anEvent.groupId, identityCommitment);

        emit EventAttended(id, msg.sender, anEvent.groupId);
    }

    function answerSurvey(
        uint256 id,
        uint256 answers,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        if (anEvent.nullifierHashes[nullifierHash])
            revert("Poavey: already answered");
        anEvent.answers.push(answers);

        semaphore.verifyProof(
            anEvent.groupId,
            merkleTreeRoot,
            answers,
            nullifierHash,
            anEvent.groupId,
            proof
        );

        emit SurveyAnswered(id, answers, anEvent.groupId);
    }

    function isAttendee(
        uint256 id,
        address attendee
    ) external view returns (bool) {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        
        return anEvent.attendees[attendee];
    }

    function isNullifierExists(
        uint256 id,
        uint256 nullifierHash
    ) external view returns (bool) {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        
        return anEvent.nullifierHashes[nullifierHash];
    }

    function getCommitments(uint256 id) external view returns (uint256[] memory) {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        
        return anEvent.commitments;
    }

    function getSurveyOptions(uint256 id) external view returns (string[] memory) {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        
        return anEvent.surveyOptions;
    }

    function getAnswers(uint256 id) external view returns (uint256[] memory) {
        Event storage anEvent = events[id];
        if (anEvent.id == 0) revert("Poavey: event does not exist");
        
        return anEvent.answers;
    }
}

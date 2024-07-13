// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v5.0.0) (governance/extensions/GovernorCountingMultiOption.sol)

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";

/**
 * @dev Extension of {Governor} for multi-option vote counting.
 */
abstract contract GovernorCountingSimple is Governor {

    enum VoteType {
        Against,
        For,
        Abstain
    }
    enum VoteOptionType {
        SingleChoice,
        MultipleChoice
    }

    struct ProposalVote {
        mapping(uint8 => uint256) optionVotes; // Maps option index to vote count
        mapping(address => bool) hasVoted;
        uint8 optionsCount; // Number of voting options for the proposal
        VoteOptionType voteOptionType; // Type of the vote (single-choice or multiple-choice)
        bytes optionsHash;
    }

    mapping(uint256 => ProposalVote) private _proposalVotes;

    /**
     * @dev See {IGovernor-COUNTING_MODE}.
     */
    // solhint-disable-next-line func-name-mixedcase
    function COUNTING_MODE() public pure virtual override returns (string memory) {
        return "support=multioption&quorum=for,abstain";
    }

    /**
     * @dev See {IGovernor-hasVoted}.
     */
    function hasVoted(uint256 proposalId, address account) public view virtual override returns (bool) {
        return _proposalVotes[proposalId].hasVoted[account];
    }

    /**
     * @dev Accessor to the internal vote counts.
     */
    function proposalVotes(
        uint256 proposalId
    ) public view virtual returns (uint256[] memory) {
        ProposalVote storage proposalVote = _proposalVotes[proposalId];
        uint256[] memory votes = new uint256[](proposalVote.optionsCount);
        for (uint8 i = 0; i < proposalVote.optionsCount; i++) {
            votes[i] = proposalVote.optionVotes[i];
        }
        return votes;
    }

    /**
     * @dev See {Governor-_quorumReached}.
     */
    function _quorumReached(uint256 proposalId) internal view virtual override returns (bool) {
        ProposalVote storage proposalVote = _proposalVotes[proposalId];
        uint256 totalVotes = 0;
        for (uint8 i = 0; i < proposalVote.optionsCount; i++) {
            totalVotes += proposalVote.optionVotes[i];
        }
        return quorum(proposalSnapshot(proposalId)) <= totalVotes;
    }

    /**
     * @dev See {Governor-_voteSucceeded}. In this module, the option with the most votes wins.
     */
    function _voteSucceeded(uint256 proposalId) internal view virtual override returns (bool) {
        ProposalVote storage proposalVote = _proposalVotes[proposalId];
        uint256 highestVotes = 0;
        for (uint8 i = 0; i < proposalVote.optionsCount; i++) {
            if (proposalVote.optionVotes[i] > highestVotes) {
                highestVotes = proposalVote.optionVotes[i];
            }
        }
        return highestVotes > 0; // Ensure there is at least one vote
    }

    /**
     * @dev See {Governor-_countVote}. In this module, the support is dynamic based on proposal options.
     */
    function _countVote(
        uint256 proposalId,
        address account,
        uint8 support,
        uint256 weight,
        bytes memory // params
    ) internal virtual override {
        ProposalVote storage proposalVote = _proposalVotes[proposalId];

        if(support >= proposalVote.optionsCount){
            revert GovernorInvalidVoteType();
        }

        if (proposalVote.hasVoted[account]) {
            revert GovernorAlreadyCastVote(account);
        }
        proposalVote.hasVoted[account] = true;

        proposalVote.optionVotes[support] += weight;
    }

    function _initProposalVoteCounter(uint256 proposalId, uint8 options, VoteOptionType _voteOptionType, bytes memory _optionsHash) internal {
        ProposalVote storage proposalVote = _proposalVotes[proposalId];
        if(_voteOptionType == VoteOptionType.SingleChoice){
            proposalVote.voteOptionType = VoteOptionType.SingleChoice;
            proposalVote.optionsCount = 3;
        } else {
            proposalVote.voteOptionType = VoteOptionType.MultipleChoice;
            proposalVote.optionsCount = options;
        }
        proposalVote.optionsHash = _optionsHash;
    }
}

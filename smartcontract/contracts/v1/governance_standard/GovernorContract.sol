// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/governance/Governor.sol";
import "./GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract GovernorContract is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _quorumPercentage,
        uint32 _votingPeriod,
        uint48 _votingDelay
    )
        Governor("GovernorContract")
        GovernorSettings(
            _votingDelay /* 1 block */, // voting delay
            _votingPeriod, // 45818, /* 1 week */ // voting period
            0 // proposal threshold
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}

    // The following functions are overrides required by Solidity.

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override virtual returns (uint256) {
        uint256 proposalId = hashProposal(
            targets,
            values,
            calldatas,
            keccak256(bytes(description))
        );
        // init vote counter
        _initProposalVoteCounter(
            proposalId,
            3,
            VoteOptionType.SingleChoice,
            "0x00"
        );

        return super.propose(targets,values,calldatas,description);
    }

    /**
     * @dev Computes the hash for a multi-option proposal.
     *
     * The proposal id is produced by hashing the ABI encoded `targets` array, the `values` array, the `calldatas` array,
     * the descriptionHash (which is the keccak256 hash of the description string), and the number of options `noOfOptions`.
     * This proposal id can be produced from the proposal data which is part of the {ProposalCreated} event. It can even be
     * computed in advance, before the proposal is submitted.
     *
     * Note that the chainId and the governor address are not part of the proposal id computation. Consequently, the same
     * proposal (with the same operations, same description, and same number of options) will have the same id if submitted
     * on multiple governors across multiple networks. This also means that in order to execute the same operation twice
     * (on the same governor), the proposer will have to change the description or the number of options in order to avoid
     * proposal id conflicts.
     */
    // function hashMultiOptionProposal(
    //     address[] memory targets,
    //     uint256[] memory values,
    //     bytes[] memory calldatas,
    //     bytes32 descriptionHash,
    //     uint8 noOfOptions
    // ) public pure virtual returns (uint256) {
    //     return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash, noOfOptions)));
    // }

    // function proposeMultiOption(
    //     address[] memory targets,
    //     uint256[] memory values,
    //     bytes[] memory calldatas,
    //     string memory description,
    //     uint8 noOfOptions,
    //     bytes calldata optionsHash
    // ) public virtual returns (uint256) {

    //     uint256 proposalId = hashMultiOptionProposal(
    //         targets,
    //         values,
    //         calldatas,
    //         keccak256(bytes(description)),
    //         noOfOptions
    //     );

    //     // init vote counter
    //     _initProposalVoteCounter(
    //         proposalId,
    //         noOfOptions,
    //         VoteOptionType.MultipleChoice,
    //         optionsHash
    //     );

    //     return GovernorContract.propose(targets,values,calldatas,description);
    // }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function _executeOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._executeOperations(
            proposalId,
            targets,
            values,
            calldatas,
            descriptionHash
        );
    }

    function _queueOperations(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint48) {
        return
            super._queueOperations(
                proposalId,
                targets,
                values,
                calldatas,
                descriptionHash
            );
    }

    function proposalNeedsQueuing(
        uint256 proposalId
    ) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.proposalNeedsQueuing(proposalId);
    }
}

import { useState, useCallback } from "react";
import { createExecution, ExecutionMode } from "@metamask/smart-accounts-kit";
import { DelegationManager } from "@metamask/smart-accounts-kit/contracts";
import { parseEther } from "viem";

// Optional: Define types for better TypeScript support
interface ExecuteParams {
  signedDelegation: any; // Replace 'any' with your actual delegation type if you have it
  targetAddress: `0x${string}`;
  ethAmount: string; // e.g., "0.0001"
}

export function useExecuteDelegation(agentSmartAccountClient: any) {
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const executeTransfer = useCallback(
    async ({ signedDelegation, targetAddress, ethAmount }: ExecuteParams) => {
      if (!agentSmartAccountClient) {
        throw new Error("Agent Smart Account Client is not initialized.");
      }

      setIsPending(true);
      setError(null);
      setTxHash(null);

      try {
        // 1. Define the action dynamically
        const execution = createExecution({
          target: targetAddress,
          value: parseEther(ethAmount),
          callData: "0x",
        });

        // 2. Encode the redemption call
        const redeemCalldata = DelegationManager.encode.redeemDelegations({
          delegations: [[signedDelegation]],
          modes: [ExecutionMode.SingleDefault],
          executions: [[execution]],
        });

        // 3. Send the transaction via the Agent
        const hash = await agentSmartAccountClient.sendTransaction({
          to: signedDelegation.delegationManager as `0x${string}`,
          data: redeemCalldata,
          value: 0n,
        });

        setTxHash(hash);
        return hash;
      } catch (err) {
        const parsedError = err instanceof Error ? err : new Error(String(err));
        setError(parsedError);
        throw parsedError; // Rethrow in case the component wants to catch it
      } finally {
        setIsPending(false);
      }
    },
    [agentSmartAccountClient],
  );

  return {
    executeTransfer,
    isPending,
    isSuccess: !!txHash,
    txHash,
    error,
  };
}

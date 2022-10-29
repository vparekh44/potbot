import { BigNumberish, BigNumber } from "ethers";
import { useState, useCallback } from "react";
import useAttestationRegistry, {
  decodeSignatureGroupProperties,
  getCorrectChainId,
} from "../utils/attester";

export default function useCredBadge(chainId: number = getCorrectChainId()) {
  const { contractRead: attestationRegistry } = useAttestationRegistry(chainId);
  const {
    getSignatureAttesterCollectionIdFirst,
    getSignatureAttesterCollectionId,
  } = useSignatureAttester(chainId);
  const [getAttestationValueLoading, setGetAttestationValueLoading] =
    useState(false);

  const hasCredBadge = useCallback(
    async (badgeId: number, owner: string): Promise<boolean> => {
      if (!attestationRegistry) return false;
      const cIdCred = await getSignatureAttesterCollectionId(badgeId);
      return await attestationRegistry.hasAttestation(cIdCred, owner);
    },
    [attestationRegistry]
  );

  const getCredBadgeData = useCallback(
    async (
      badgeId: number,
      owner: string
    ): Promise<DecodedSignatureAttesterBadgeExtraData | undefined> => {
      if (!attestationRegistry) return undefined;
      const cIdCred = await getSignatureAttesterCollectionId(badgeId);
      const attestationExtraDataBytes =
        await attestationRegistry.getAttestationExtraData(cIdCred, owner);
      if (attestationExtraDataBytes === "0x") return undefined;
      const [[cId, updatedAt, badgeType, source, badgeData]] =
        decodeSignatureGroupProperties(attestationExtraDataBytes);
      return {
        cId,
        updatedAt,
        badgeType,
        source,
        badgeData,
      };
    },
    [attestationRegistry, getSignatureAttesterCollectionId]
  );

  const getAttestationValue = useCallback(
    async (
      badgeId: number,
      owner: string
    ): Promise<BigNumberish | undefined> => {
      setGetAttestationValueLoading(true);
      if (!attestationRegistry) return undefined;
      const cId = await getSignatureAttesterCollectionId(badgeId);
      const attestationValue = await attestationRegistry.getAttestationValue(
        cId,
        owner
      );
      setGetAttestationValueLoading(false);
      return attestationValue;
    },
    [attestationRegistry, getSignatureAttesterCollectionId]
  );

  const getAttestationValues = useCallback(
    async (
      badgeIds: BigNumber[],
      owners: string[]
    ): Promise<BigNumberish[] | undefined> => {
      if (!attestationRegistry) return undefined;
      const cIdFirst = await getSignatureAttesterCollectionIdFirst();
      const cIds = badgeIds.map((badgeId) => cIdFirst.add(badgeId));
      const attestationValues =
        await attestationRegistry.getAttestationValueBatch(cIds, owners);
      return attestationValues;
    },
    [attestationRegistry, getSignatureAttesterCollectionIdFirst]
  );

  return {
    hasCredBadge,
    getCredBadgeData,
    getAttestationValues,
    getAttestationValue,
    getAttestationValueLoading,
  };
}

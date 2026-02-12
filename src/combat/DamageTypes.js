// Pure data contracts

export function createDamagePacket({
  amount,
  source,
  attack = null,
  type = "physical",
  hitReaction = null,
  flags = {},
}) {
  return {
    amount,
    source,
    attack,
    type,
    hitReaction,
    flags,
  };
}

export function createDamageResult({
  applied,
  amount = 0,
  killed = false,
  blocked = false,
  triggeredInvincibility = false,
}) {
  return {
    applied,
    amount,
    killed,
    blocked,
    triggeredInvincibility,
  };
}

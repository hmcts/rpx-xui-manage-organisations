export async function createDXNumber() {
  const randomDX = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomDX.toString();
}

export async function createDXENumber() {
  const randomDXE = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomDXE.toString();
}

export async function createSRANumber() {
  const ramdomSRA = Math.floor(Math.random() * 9000000000) + 1000000000;
  return ramdomSRA.toString();
}

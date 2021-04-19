export class UpdatePbaNumbers {
  public existingPbaNumbers: string[] = [];
  public pendingAddPbaNumbers: string[] = [];
  public pendingRemovePbaNumbers: string[] = [];

  constructor(existingPbaNumbers: string[]) {
    this.existingPbaNumbers = existingPbaNumbers;
  }

  get hasDisplayPbaNumbers(): boolean {
    return this.displayPbaNumbers.length > 0;
  }

  get displayPbaNumbers(): string[] {
    return this.existingPbaNumbers.filter(pba => this.pendingRemovePbaNumbers.indexOf(pba) === -1);
  }

  /**
   * Current PBA Numbers contain existing and pending additions, minus pending removals
   */
  get currentPbaNumbers(): string[] {
    const currentPbas = this.existingPbaNumbers
      .concat(this.pendingAddPbaNumbers)
      .filter(pba => this.pendingRemovePbaNumbers.indexOf(pba) === -1);

    console.log(currentPbas);

    return currentPbas;
  }

  public addPbaNumberToPendingRemove(pba: string): void {
    const alreadyInPendingRemove = this.pendingRemovePbaNumbers.indexOf(pba) != -1;
    if (alreadyInPendingRemove) return;

    this.pendingRemovePbaNumbers.push(pba);
  }

  public addPbaNumberToPendingAdd(pba: string): void {
    const alreadyInPendingAdd = this.pendingAddPbaNumbers.indexOf(pba) != -1;
    if (alreadyInPendingAdd) return;

    this.pendingAddPbaNumbers.push(pba);
  }
}

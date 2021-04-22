export interface UpdateOrganisationPbaNumbers {
  existingPbaNumbers: string[];
  pendingAddPbaNumbers: string[];
  pendingRemovePbaNumbers: string[];
}

export class UpdatePbaNumbers implements UpdateOrganisationPbaNumbers {
  public existingPbaNumbers: string[];
  public pendingAddPbaNumbers: any[];
  public pendingRemovePbaNumbers: string[];

  constructor(existingPbaNumbers: string[]) {
    this.existingPbaNumbers = existingPbaNumbers;
    this.pendingAddPbaNumbers = [];
    this.pendingRemovePbaNumbers = [];
  }

  get hasDisplayPbaNumbers(): boolean {
    return this.displayPbaNumbers.length > 0;
  }

  get hasPendingAddPbaNumbers(): boolean {
    if (!this.pendingAddPbaNumbers) this.pendingAddPbaNumbers = [];

    return this.pendingAddPbaNumbers.length > 0;
  }

  get hasPendingRemovePbaNumbers(): boolean {
    if (!this.pendingRemovePbaNumbers) this.pendingRemovePbaNumbers = [];

    return this.pendingRemovePbaNumbers.length > 0;
  }

  get displayPbaNumbers(): string[] {
    if (!this.existingPbaNumbers) return [];
    if (!this.pendingRemovePbaNumbers) this.pendingRemovePbaNumbers = [];

    return this.existingPbaNumbers.filter(pba => this.pendingRemovePbaNumbers.indexOf(pba) === -1);
  }

  /**
   * Current PBA Numbers contain existing and pending additions, minus pending removals
   */
  get currentPbaNumbers(): string[] {
    const currentPbas = this.existingPbaNumbers
      .concat(this.pendingAddPbaNumbers)
      .filter(pba => this.pendingRemovePbaNumbers.indexOf(pba) === -1);

    return currentPbas;
  }

  public addPbaNumberToPendingRemove(pba: string): void {
    console.log(this.pendingRemovePbaNumbers);

    if (this.pendingRemovePbaNumbers.indexOf(pba) !== -1) return;

    this.pendingRemovePbaNumbers.push(pba);
  }

  public addPbaNumberToPendingAdd(pba: string): void {
    if (this.pendingAddPbaNumbers.indexOf(pba) !== -1) return;

    console.log(this);

    this.pendingAddPbaNumbers.push('hello')
  }
}

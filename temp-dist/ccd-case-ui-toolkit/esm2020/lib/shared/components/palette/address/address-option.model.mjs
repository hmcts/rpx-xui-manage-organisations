export class AddressOption {
    constructor(addressModel, description) {
        if (description === null) {
            this.value = addressModel;
            this.description = this.getDescription();
        }
        else {
            this.description = description;
        }
    }
    getDescription() {
        return this.removeInitialCommaIfPresent(`${this.value.AddressLine1 === undefined ? '' : this.value.AddressLine1}${this.prefixWithCommaIfPresent(this.value.AddressLine2)}${this.prefixWithCommaIfPresent(this.value.AddressLine3)}, ${this.value.PostTown}`);
    }
    prefixWithCommaIfPresent(value) {
        return value ? `, ${value}` : value;
    }
    removeInitialCommaIfPresent(value) {
        return value.replace(new RegExp('^,', 'gi'), '');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkcmVzcy1vcHRpb24ubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9jY2QtY2FzZS11aS10b29sa2l0L3NyYy9saWIvc2hhcmVkL2NvbXBvbmVudHMvcGFsZXR0ZS9hZGRyZXNzL2FkZHJlc3Mtb3B0aW9uLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sT0FBTyxhQUFhO0lBSXhCLFlBQWEsWUFBMEIsRUFBRSxXQUFtQjtRQUMxRCxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVPLGNBQWM7UUFDcEIsT0FBTyxJQUFJLENBQUMsMkJBQTJCLENBQ3JDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQ3BOLENBQUM7SUFDSixDQUFDO0lBRU8sd0JBQXdCLENBQUMsS0FBYTtRQUM1QyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3RDLENBQUM7SUFFTywyQkFBMkIsQ0FBQyxLQUFhO1FBQy9DLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkQsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWRkcmVzc01vZGVsIH0gZnJvbSAnLi4vLi4vLi4vZG9tYWluL2FkZHJlc3Nlcy9hZGRyZXNzLm1vZGVsJztcblxuZXhwb3J0IGNsYXNzIEFkZHJlc3NPcHRpb24ge1xuICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZztcbiAgcHVibGljIHZhbHVlOiBBZGRyZXNzTW9kZWw7XG5cbiAgY29uc3RydWN0b3IgKGFkZHJlc3NNb2RlbDogQWRkcmVzc01vZGVsLCBkZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKGRlc2NyaXB0aW9uID09PSBudWxsKSB7XG4gICAgICB0aGlzLnZhbHVlID0gYWRkcmVzc01vZGVsO1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IHRoaXMuZ2V0RGVzY3JpcHRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlSW5pdGlhbENvbW1hSWZQcmVzZW50KFxuICAgICAgYCR7dGhpcy52YWx1ZS5BZGRyZXNzTGluZTEgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcy52YWx1ZS5BZGRyZXNzTGluZTF9JHt0aGlzLnByZWZpeFdpdGhDb21tYUlmUHJlc2VudCh0aGlzLnZhbHVlLkFkZHJlc3NMaW5lMil9JHt0aGlzLnByZWZpeFdpdGhDb21tYUlmUHJlc2VudCh0aGlzLnZhbHVlLkFkZHJlc3NMaW5lMyl9LCAke3RoaXMudmFsdWUuUG9zdFRvd259YFxuICAgICk7XG4gIH1cblxuICBwcml2YXRlIHByZWZpeFdpdGhDb21tYUlmUHJlc2VudCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhbHVlID8gYCwgJHt2YWx1ZX1gIDogdmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZUluaXRpYWxDb21tYUlmUHJlc2VudCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UobmV3IFJlZ0V4cCgnXiwnLCAnZ2knKSwgJycpO1xuICB9XG59XG4iXX0=
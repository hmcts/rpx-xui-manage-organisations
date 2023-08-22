import * as _score from 'underscore';
import { FieldsUtils } from '../../../services/fields/fields.utils';
import { ShowCondition } from '../../conditional-show/domain/conditional-show.model';
import peg from './condition.peg';
export class ConditionParser {
    /**
     * Parse the raw formula and output structured condition data
     * that can be used in evaluating show/hide logic
     * @param condition raw formula e.g. TextField = "Hello"
     */
    static parse(condition) {
        if (!condition) {
            return null;
        }
        condition = condition.replace(/CONTAINS/g, ' CONTAINS');
        return peg.parse(condition.trim(), {});
    }
    /**
     * Evaluate the current fields against the conditions
     * @param fields the current page fields and their value
     * @param conditions The PegJS formula output
     */
    static evaluate(fields, conditions, path) {
        if (!conditions || conditions.length === 0) {
            return true;
        }
        const validJoinComparators = ['AND', 'OR'];
        return conditions.reduce((accumulator, condition, index) => {
            const isJoinComparator = (comparator) => (typeof comparator === 'string' && validJoinComparators.indexOf(comparator) !== -1);
            if (isJoinComparator(condition)) {
                return accumulator;
            }
            let currentConditionResult = true;
            if (Array.isArray(condition)) {
                currentConditionResult = this.evaluate(fields, condition);
                if (isJoinComparator(conditions[index - 1])) {
                    return this.evaluateJoin(accumulator, conditions[index - 1], currentConditionResult);
                }
            }
            if (condition.comparator) {
                const formula = condition.fieldReference + condition.comparator + condition.value;
                currentConditionResult = this.matchEqualityCondition(fields, formula, path);
            }
            if (isJoinComparator(conditions[index - 1])) {
                return this.evaluateJoin(accumulator, conditions[index - 1], currentConditionResult);
            }
            return currentConditionResult;
        }, true);
    }
    static evaluateJoin(leftResult, comparator, rightResult) {
        // tslint:disable-next-line:switch-default
        switch (comparator) {
            case 'OR': return leftResult || rightResult;
            case 'AND': return leftResult && rightResult;
        }
    }
    static matchEqualityCondition(fields, condition, path) {
        const [field, conditionSeparator] = this.getField(condition);
        const [head, ...tail] = field.split('.');
        const currentValue = this.findValueForComplexCondition(fields, head, tail, path);
        const expectedValue = this.unquoted(condition.split(conditionSeparator)[1]);
        if (conditionSeparator === ShowCondition.CONTAINS) {
            return this.checkValueContains(expectedValue, currentValue);
        }
        else {
            return this.checkValueEquals(expectedValue, currentValue, conditionSeparator);
        }
    }
    static getValue(fields, head) {
        if (this.isDynamicList(fields[head])) {
            return fields[head].value.code;
        }
        else {
            return fields[head];
        }
    }
    static isDynamicList(dynamiclist) {
        return !_score.isEmpty(dynamiclist) &&
            (_score.has(dynamiclist, 'value') && _score.has(dynamiclist, 'list_items'));
    }
    static getField(condition) {
        let separator = ShowCondition.CONTAINS;
        if (condition.indexOf(ShowCondition.CONTAINS) < 0) {
            separator = ShowCondition.CONDITION_EQUALS;
            if (condition.indexOf(ShowCondition.CONDITION_NOT_EQUALS) > -1) {
                separator = ShowCondition.CONDITION_NOT_EQUALS;
            }
        }
        return [condition.split(separator)[0], separator];
    }
    static checkValueEquals(expectedValue, currentValue, conditionSeparaor) {
        if (expectedValue.search('[,]') > -1) { // for  multi-select list
            return this.checkMultiSelectListEquals(expectedValue, currentValue, conditionSeparaor);
        }
        else if (expectedValue.endsWith('*') && currentValue && conditionSeparaor !== ShowCondition.CONDITION_NOT_EQUALS) {
            if (typeof currentValue === 'string') {
                return currentValue.startsWith(this.removeStarChar(expectedValue));
            }
            return expectedValue === '*';
        }
        else {
            // changed from '===' to '==' to cover number field conditions
            if (conditionSeparaor === ShowCondition.CONDITION_NOT_EQUALS) {
                return this.checkValueNotEquals(expectedValue, currentValue);
            }
            else {
                return currentValue == expectedValue || this.okIfBothEmpty(expectedValue, currentValue); // tslint:disable-line
            }
        }
    }
    static checkValueNotEquals(expectedValue, currentValue) {
        const formatCurrentValue = currentValue ? currentValue.toString().trim() : '';
        if ('*' === expectedValue && formatCurrentValue !== '') {
            return false;
        }
        const formatExpectedValue = expectedValue ? expectedValue.toString().trim() : '';
        return formatCurrentValue != formatExpectedValue; // tslint:disable-line
    }
    static checkMultiSelectListEquals(expectedValue, currentValue, conditionSeparator) {
        const expectedValues = expectedValue.split(',').sort().toString();
        const values = currentValue ? currentValue.sort().toString() : '';
        if (conditionSeparator === ShowCondition.CONDITION_NOT_EQUALS) {
            return expectedValues !== values;
        }
        else {
            return expectedValues === values;
        }
    }
    static checkValueContains(expectedValue, currentValue) {
        if (expectedValue.search(',') > -1) {
            const expectedValues = expectedValue.split(',').sort();
            const values = currentValue ? currentValue.sort().toString() : '';
            return expectedValues.every(item => values.search(item) >= 0);
        }
        else {
            const values = currentValue && Array.isArray(currentValue) ? currentValue.toString() : '';
            return values.search(expectedValue) >= 0;
        }
    }
    static unquoted(str) {
        return str.replace(/^"|"$/g, '');
    }
    static findValueForComplexCondition(fields, head, tail, path) {
        if (!fields) {
            return undefined;
        }
        if (tail.length === 0) {
            return this.getValue(fields, head);
        }
        else {
            if (FieldsUtils.isArray(fields[head])) {
                return this.findValueForComplexConditionInArray(fields, head, tail, path);
            }
            else {
                return this.findValueForComplexConditionForPathIfAny(fields, head, tail, path);
            }
        }
    }
    static findValueForComplexConditionForPathIfAny(fields, head, tail, path) {
        if (path) {
            const [_, ...pathTail] = path.split(/[_]+/g);
            return this.findValueForComplexCondition(fields[head], tail[0], tail.slice(1), pathTail.join('_'));
        }
        else if (!fields[head]) {
            return this.findValueForComplexCondition(fields, tail[0], tail.slice(1), path);
        }
        else {
            return this.findValueForComplexCondition(fields[head], tail[0], tail.slice(1), path);
        }
    }
    static findValueForComplexConditionInArray(fields, head, tail, path) {
        // use the path to resolve which array element we refer to
        if (path.startsWith(head)) {
            const [_, ...pathTail] = path.split(/[_]+/g);
            if (pathTail.length > 0) {
                try {
                    const arrayIndex = Number.parseInt(pathTail[0], 10);
                    const [__, ...dropNumberPath] = pathTail;
                    return (fields[head][arrayIndex] !== undefined) ? this.findValueForComplexCondition(fields[head][arrayIndex]['value'], tail[0], tail.slice(1), dropNumberPath.join('_')) : null;
                }
                catch (e) {
                    console.error('Error while parsing number', pathTail[0], e);
                }
            }
        }
        else {
            console.error('Path in formArray should start with ', head, ', full path: ', path);
        }
    }
    static removeStarChar(str) {
        if (str && str.indexOf('*') > -1) {
            return str.substring(0, str.indexOf('*'));
        }
        return str;
    }
    static okIfBothEmpty(right, value) {
        return value === null && (right === '');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uLXBhcnNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY2NkLWNhc2UtdWktdG9vbGtpdC9zcmMvbGliL3NoYXJlZC9kaXJlY3RpdmVzL2NvbmRpdGlvbmFsLXNob3cvc2VydmljZXMvY29uZGl0aW9uLXBhcnNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0RBQXNELENBQUM7QUFDckYsT0FBTyxHQUFHLE1BQU0saUJBQWlCLENBQUM7QUFFbEMsTUFBTSxPQUFPLGVBQWU7SUFDMUI7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBaUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7UUFDaEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQVcsRUFBRSxVQUFpQixFQUFFLElBQWE7UUFDbEUsSUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sSUFBSSxDQUFDO1NBQUU7UUFDNUQsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUzQyxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFvQixFQUFFLFNBQVMs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QUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUM3RjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixPQUFPLENBQUMsS0FBSyxDQUFDLDRCQUE0QixFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0Q7YUFDRjtTQUNGO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEY7SUFDSCxDQUFDO0lBRU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFXO1FBQ3ZDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDaEMsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQWEsRUFBRSxLQUFVO1FBQ3BELE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUMsQ0FBQztJQUMxQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBfc2NvcmUgZnJvbSAndW5kZXJzY29yZSc7XG5pbXBvcnQgeyBGaWVsZHNVdGlscyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2ZpZWxkcy9maWVsZHMudXRpbHMnO1xuaW1wb3J0IHsgU2hvd0NvbmRpdGlvbiB9IGZyb20gJy4uLy4uL2NvbmRpdGlvbmFsLXNob3cvZG9tYWluL2NvbmRpdGlvbmFsLXNob3cubW9kZWwnO1xuaW1wb3J0IHBlZyBmcm9tICcuL2NvbmRpdGlvbi5wZWcnO1xuXG5leHBvcnQgY2xhc3MgQ29uZGl0aW9uUGFyc2VyIHtcbiAgLyoqXG4gICAqIFBhcnNlIHRoZSByYXcgZm9ybXVsYSBhbmQgb3V0cHV0IHN0cnVjdHVyZWQgY29uZGl0aW9uIGRhdGFcbiAgICogdGhhdCBjYW4gYmUgdXNlZCBpbiBldmFsdWF0aW5nIHNob3cvaGlkZSBsb2dpY1xuICAgKiBAcGFyYW0gY29uZGl0aW9uIHJhdyBmb3JtdWxhIGUuZy4gVGV4dEZpZWxkID0gXCJIZWxsb1wiXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHBhcnNlKGNvbmRpdGlvbjogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIWNvbmRpdGlvbikgeyByZXR1cm4gbnVsbDsgfVxuICAgIGNvbmRpdGlvbiA9IGNvbmRpdGlvbi5yZXBsYWNlKC9DT05UQUlOUy9nLCAnIENPTlRBSU5TJyk7XG4gICAgcmV0dXJuIHBlZy5wYXJzZShjb25kaXRpb24udHJpbSgpLCB7fSk7XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGUgdGhlIGN1cnJlbnQgZmllbGRzIGFnYWluc3QgdGhlIGNvbmRpdGlvbnNcbiAgICogQHBhcmFtIGZpZWxkcyB0aGUgY3VycmVudCBwYWdlIGZpZWxkcyBhbmQgdGhlaXIgdmFsdWVcbiAgICogQHBhcmFtIGNvbmRpdGlvbnMgVGhlIFBlZ0pTIGZvcm11bGEgb3V0cHV0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGV2YWx1YXRlKGZpZWxkczogYW55LCBjb25kaXRpb25zOiBhbnlbXSwgcGF0aD86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICghY29uZGl0aW9ucyB8fCBjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIGNvbnN0IHZhbGlkSm9pbkNvbXBhcmF0b3JzID0gWydBTkQnLCAnT1InXTtcblxuICAgIHJldHVybiBjb25kaXRpb25zLnJlZHVjZSgoYWNjdW11bGF0b3I6IGJvb2xlYW4sIGNvbmRpdGlvbiwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgY29uc3QgaXNKb2luQ29tcGFyYXRvciA9IChjb21wYXJhdG9yOiBzdHJpbmcpOiBib29sZWFuID0+XG4gICAgICAgICh0eXBlb2YgY29tcGFyYXRvciA9PT0gJ3N0cmluZycgJiYgdmFsaWRKb2luQ29tcGFyYXRvcnMuaW5kZXhPZihjb21wYXJhdG9yKSAhPT0gLTEpO1xuXG4gICAgICBpZiAoaXNKb2luQ29tcGFyYXRvcihjb25kaXRpb24pKSB7IHJldHVybiBhY2N1bXVsYXRvcjsgfVxuXG4gICAgICBsZXQgY3VycmVudENvbmRpdGlvblJlc3VsdCA9IHRydWU7XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGNvbmRpdGlvbikpIHtcbiAgICAgICAgY3VycmVudENvbmRpdGlvblJlc3VsdCA9IHRoaXMuZXZhbHVhdGUoZmllbGRzLCBjb25kaXRpb24pO1xuXG4gICAgICAgIGlmIChpc0pvaW5Db21wYXJhdG9yKGNvbmRpdGlvbnNbaW5kZXggLSAxXSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ldmFsdWF0ZUpvaW4oYWNjdW11bGF0b3IsIGNvbmRpdGlvbnNbaW5kZXggLSAxXSwgY3VycmVudENvbmRpdGlvblJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNvbmRpdGlvbi5jb21wYXJhdG9yKSB7XG4gICAgICAgIGNvbnN0IGZvcm11bGEgPSBjb25kaXRpb24uZmllbGRSZWZlcmVuY2UgKyBjb25kaXRpb24uY29tcGFyYXRvciArIGNvbmRpdGlvbi52YWx1ZTtcbiAgICAgICAgY3VycmVudENvbmRpdGlvblJlc3VsdCA9IHRoaXMubWF0Y2hFcXVhbGl0eUNvbmRpdGlvbihmaWVsZHMsIGZvcm11bGEsIHBhdGgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNKb2luQ29tcGFyYXRvcihjb25kaXRpb25zW2luZGV4IC0gMV0pKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2YWx1YXRlSm9pbihhY2N1bXVsYXRvciwgY29uZGl0aW9uc1tpbmRleCAtIDFdLCBjdXJyZW50Q29uZGl0aW9uUmVzdWx0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGN1cnJlbnRDb25kaXRpb25SZXN1bHQ7XG4gICAgfSwgdHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBldmFsdWF0ZUpvaW4obGVmdFJlc3VsdDogYm9vbGVhbiwgY29tcGFyYXRvciwgcmlnaHRSZXN1bHQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6c3dpdGNoLWRlZmF1bHRcbiAgICBzd2l0Y2ggKGNvbXBhcmF0b3IpIHtcbiAgICAgIGNhc2UgJ09SJzogcmV0dXJuIGxlZnRSZXN1bHQgfHwgcmlnaHRSZXN1bHQ7XG4gICAgICBjYXNlICdBTkQnOiByZXR1cm4gbGVmdFJlc3VsdCAmJiByaWdodFJlc3VsdDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBtYXRjaEVxdWFsaXR5Q29uZGl0aW9uKGZpZWxkczogb2JqZWN0LCBjb25kaXRpb246IHN0cmluZywgcGF0aD86IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IFtmaWVsZCwgY29uZGl0aW9uU2VwYXJhdG9yXSA9IHRoaXMuZ2V0RmllbGQoY29uZGl0aW9uKTtcbiAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBmaWVsZC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuZmluZFZhbHVlRm9yQ29tcGxleENvbmRpdGlvbihmaWVsZHMsIGhlYWQsIHRhaWwsIHBhdGgpO1xuICAgIGNvbnN0IGV4cGVjdGVkVmFsdWUgPSB0aGlzLnVucXVvdGVkKGNvbmRpdGlvbi5zcGxpdChjb25kaXRpb25TZXBhcmF0b3IpWzFdKTtcbiAgICBpZiAoY29uZGl0aW9uU2VwYXJhdG9yID09PSBTaG93Q29uZGl0aW9uLkNPTlRBSU5TKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGVja1ZhbHVlQ29udGFpbnMoZXhwZWN0ZWRWYWx1ZSwgY3VycmVudFZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tWYWx1ZUVxdWFscyhleHBlY3RlZFZhbHVlLCBjdXJyZW50VmFsdWUsIGNvbmRpdGlvblNlcGFyYXRvcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0VmFsdWUoZmllbGRzOiBvYmplY3QsIGhlYWQ6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKHRoaXMuaXNEeW5hbWljTGlzdChmaWVsZHNbaGVhZF0pKSB7XG4gICAgICByZXR1cm4gZmllbGRzW2hlYWRdLnZhbHVlLmNvZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmaWVsZHNbaGVhZF07XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaXNEeW5hbWljTGlzdChkeW5hbWljbGlzdDogb2JqZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICFfc2NvcmUuaXNFbXB0eShkeW5hbWljbGlzdCkgJiZcbiAgICAgICAgKF9zY29yZS5oYXMoZHluYW1pY2xpc3QsICd2YWx1ZScpICYmIF9zY29yZS5oYXMoZHluYW1pY2xpc3QsICdsaXN0X2l0ZW1zJykpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0RmllbGQoY29uZGl0aW9uOiBzdHJpbmcpOiBbc3RyaW5nLCBzdHJpbmc/XSB7XG4gICAgbGV0IHNlcGFyYXRvcjogc3RyaW5nID0gU2hvd0NvbmRpdGlvbi5DT05UQUlOUztcbiAgICBpZiAoY29uZGl0aW9uLmluZGV4T2YoU2hvd0NvbmRpdGlvbi5DT05UQUlOUykgPCAwKSB7XG4gICAgICBzZXBhcmF0b3IgPSBTaG93Q29uZGl0aW9uLkNPTkRJVElPTl9FUVVBTFM7XG4gICAgICBpZiAoY29uZGl0aW9uLmluZGV4T2YoU2hvd0NvbmRpdGlvbi5DT05ESVRJT05fTk9UX0VRVUFMUykgPiAtMSkge1xuICAgICAgICBzZXBhcmF0b3IgPSBTaG93Q29uZGl0aW9uLkNPTkRJVElPTl9OT1RfRVFVQUxTO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gWyBjb25kaXRpb24uc3BsaXQoc2VwYXJhdG9yKVswXSwgc2VwYXJhdG9yIF07XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjaGVja1ZhbHVlRXF1YWxzKGV4cGVjdGVkVmFsdWU6IHN0cmluZywgY3VycmVudFZhbHVlOiBhbnksIGNvbmRpdGlvblNlcGFyYW9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoZXhwZWN0ZWRWYWx1ZS5zZWFyY2goJ1ssXScpID4gLTEpIHsgLy8gZm9yICBtdWx0aS1zZWxlY3QgbGlzdFxuICAgICAgcmV0dXJuIHRoaXMuY2hlY2tNdWx0aVNlbGVjdExpc3RFcXVhbHMoZXhwZWN0ZWRWYWx1ZSwgY3VycmVudFZhbHVlLCBjb25kaXRpb25TZXBhcmFvcik7XG4gICAgfSBlbHNlIGlmIChleHBlY3RlZFZhbHVlLmVuZHNXaXRoKCcqJykgJiYgY3VycmVudFZhbHVlICYmIGNvbmRpdGlvblNlcGFyYW9yICE9PSBTaG93Q29uZGl0aW9uLkNPTkRJVElPTl9OT1RfRVFVQUxTKSB7XG4gICAgICBpZiAodHlwZW9mIGN1cnJlbnRWYWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZS5zdGFydHNXaXRoKHRoaXMucmVtb3ZlU3RhckNoYXIoZXhwZWN0ZWRWYWx1ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGV4cGVjdGVkVmFsdWUgPT09ICcqJztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2hhbmdlZCBmcm9tICc9PT0nIHRvICc9PScgdG8gY292ZXIgbnVtYmVyIGZpZWxkIGNvbmRpdGlvbnNcbiAgICAgIGlmIChjb25kaXRpb25TZXBhcmFvciA9PT0gU2hvd0NvbmRpdGlvbi5DT05ESVRJT05fTk9UX0VRVUFMUykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGVja1ZhbHVlTm90RXF1YWxzKGV4cGVjdGVkVmFsdWUsIGN1cnJlbnRWYWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlID09IGV4cGVjdGVkVmFsdWUgfHwgdGhpcy5va0lmQm90aEVtcHR5KGV4cGVjdGVkVmFsdWUsIGN1cnJlbnRWYWx1ZSk7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjaGVja1ZhbHVlTm90RXF1YWxzKGV4cGVjdGVkVmFsdWU6IHN0cmluZywgY3VycmVudFZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICBjb25zdCBmb3JtYXRDdXJyZW50VmFsdWUgPSBjdXJyZW50VmFsdWUgPyBjdXJyZW50VmFsdWUudG9TdHJpbmcoKS50cmltKCkgOiAnJztcbiAgICBpZiAoJyonID09PSBleHBlY3RlZFZhbHVlICYmIGZvcm1hdEN1cnJlbnRWYWx1ZSAhPT0gJycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZm9ybWF0RXhwZWN0ZWRWYWx1ZSA9IGV4cGVjdGVkVmFsdWUgPyBleHBlY3RlZFZhbHVlLnRvU3RyaW5nKCkudHJpbSgpIDogJyc7XG4gICAgcmV0dXJuIGZvcm1hdEN1cnJlbnRWYWx1ZSAhPSBmb3JtYXRFeHBlY3RlZFZhbHVlOyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjaGVja011bHRpU2VsZWN0TGlzdEVxdWFscyhleHBlY3RlZFZhbHVlOiBzdHJpbmcsIGN1cnJlbnRWYWx1ZTogYW55LCBjb25kaXRpb25TZXBhcmF0b3I6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gZXhwZWN0ZWRWYWx1ZS5zcGxpdCgnLCcpLnNvcnQoKS50b1N0cmluZygpO1xuICAgIGNvbnN0IHZhbHVlcyA9IGN1cnJlbnRWYWx1ZSA/IGN1cnJlbnRWYWx1ZS5zb3J0KCkudG9TdHJpbmcoKSA6ICcnO1xuICAgIGlmIChjb25kaXRpb25TZXBhcmF0b3IgPT09IFNob3dDb25kaXRpb24uQ09ORElUSU9OX05PVF9FUVVBTFMpIHtcbiAgICAgIHJldHVybiBleHBlY3RlZFZhbHVlcyAhPT0gdmFsdWVzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZXhwZWN0ZWRWYWx1ZXMgPT09IHZhbHVlcztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjaGVja1ZhbHVlQ29udGFpbnMoZXhwZWN0ZWRWYWx1ZTogc3RyaW5nLCBjdXJyZW50VmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChleHBlY3RlZFZhbHVlLnNlYXJjaCgnLCcpID4gLTEpIHtcbiAgICAgIGNvbnN0IGV4cGVjdGVkVmFsdWVzID0gZXhwZWN0ZWRWYWx1ZS5zcGxpdCgnLCcpLnNvcnQoKTtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IGN1cnJlbnRWYWx1ZSA/IGN1cnJlbnRWYWx1ZS5zb3J0KCkudG9TdHJpbmcoKSA6ICcnO1xuICAgICAgcmV0dXJuIGV4cGVjdGVkVmFsdWVzLmV2ZXJ5KGl0ZW0gPT4gdmFsdWVzLnNlYXJjaChpdGVtKSA+PSAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdmFsdWVzID0gY3VycmVudFZhbHVlICYmIEFycmF5LmlzQXJyYXkoY3VycmVudFZhbHVlKSA/IGN1cnJlbnRWYWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgICByZXR1cm4gdmFsdWVzLnNlYXJjaChleHBlY3RlZFZhbHVlKSA+PSAwO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHVucXVvdGVkKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoL15cInxcIiQvZywgJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZmluZFZhbHVlRm9yQ29tcGxleENvbmRpdGlvbihmaWVsZHM6IG9iamVjdCwgaGVhZDogc3RyaW5nLCB0YWlsOiBzdHJpbmdbXSwgcGF0aD86IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKCFmaWVsZHMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0YWlsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoZmllbGRzLCBoZWFkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKEZpZWxkc1V0aWxzLmlzQXJyYXkoZmllbGRzW2hlYWRdKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maW5kVmFsdWVGb3JDb21wbGV4Q29uZGl0aW9uSW5BcnJheShmaWVsZHMsIGhlYWQsIHRhaWwsIHBhdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZFZhbHVlRm9yQ29tcGxleENvbmRpdGlvbkZvclBhdGhJZkFueShmaWVsZHMsIGhlYWQsIHRhaWwsIHBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGZpbmRWYWx1ZUZvckNvbXBsZXhDb25kaXRpb25Gb3JQYXRoSWZBbnkoZmllbGRzOiBvYmplY3QsIGhlYWQ6IHN0cmluZywgdGFpbDogc3RyaW5nW10sIHBhdGg/OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmIChwYXRoKSB7XG4gICAgICBjb25zdCBbXywgLi4ucGF0aFRhaWxdID0gcGF0aC5zcGxpdCgvW19dKy9nKTtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRWYWx1ZUZvckNvbXBsZXhDb25kaXRpb24oZmllbGRzW2hlYWRdLCB0YWlsWzBdLCB0YWlsLnNsaWNlKDEpLCBwYXRoVGFpbC5qb2luKCdfJykpO1xuICAgIH0gZWxzZSBpZiAoIWZpZWxkc1toZWFkXSkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZFZhbHVlRm9yQ29tcGxleENvbmRpdGlvbihmaWVsZHMsIHRhaWxbMF0sIHRhaWwuc2xpY2UoMSksIHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kVmFsdWVGb3JDb21wbGV4Q29uZGl0aW9uKGZpZWxkc1toZWFkXSwgdGFpbFswXSwgdGFpbC5zbGljZSgxKSwgcGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZmluZFZhbHVlRm9yQ29tcGxleENvbmRpdGlvbkluQXJyYXkoZmllbGRzOiBvYmplY3QsIGhlYWQ6IHN0cmluZywgdGFpbDogc3RyaW5nW10sIHBhdGg/OiBzdHJpbmcpOiBhbnkge1xuICAgIC8vIHVzZSB0aGUgcGF0aCB0byByZXNvbHZlIHdoaWNoIGFycmF5IGVsZW1lbnQgd2UgcmVmZXIgdG9cbiAgICBpZiAocGF0aC5zdGFydHNXaXRoKGhlYWQpKSB7XG4gICAgICBjb25zdCBbXywgLi4ucGF0aFRhaWxdID0gcGF0aC5zcGxpdCgvW19dKy9nKTtcbiAgICAgIGlmIChwYXRoVGFpbC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgYXJyYXlJbmRleCA9IE51bWJlci5wYXJzZUludChwYXRoVGFpbFswXSwgMTApO1xuICAgICAgICAgIGNvbnN0IFtfXywgLi4uZHJvcE51bWJlclBhdGhdID0gcGF0aFRhaWw7XG4gICAgICAgICAgcmV0dXJuIChmaWVsZHNbaGVhZF1bYXJyYXlJbmRleF0gIT09IHVuZGVmaW5lZCkgPyB0aGlzLmZpbmRWYWx1ZUZvckNvbXBsZXhDb25kaXRpb24oXG4gICAgICAgICAgZmllbGRzW2hlYWRdW2FycmF5SW5kZXhdWyd2YWx1ZSddLCB0YWlsWzBdLCB0YWlsLnNsaWNlKDEpLCBkcm9wTnVtYmVyUGF0aC5qb2luKCdfJykpIDogbnVsbDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHdoaWxlIHBhcnNpbmcgbnVtYmVyJywgcGF0aFRhaWxbMF0sIGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1BhdGggaW4gZm9ybUFycmF5IHNob3VsZCBzdGFydCB3aXRoICcsIGhlYWQsICcsIGZ1bGwgcGF0aDogJywgcGF0aCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgcmVtb3ZlU3RhckNoYXIoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGlmIChzdHIgJiYgc3RyLmluZGV4T2YoJyonKSA+IC0xKSB7XG4gICAgICByZXR1cm4gc3RyLnN1YnN0cmluZygwLCBzdHIuaW5kZXhPZignKicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIG9rSWZCb3RoRW1wdHkocmlnaHQ6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCAmJiAocmlnaHQgPT09ICcnKTtcbiAgfVxufVxuIl19
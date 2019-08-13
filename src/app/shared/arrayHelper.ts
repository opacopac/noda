export class ArrayHelper {
    public static isEqualStringList(list1: string[], list2: string[], ignoreCase = true): boolean {
        if (list1.length !== list2.length) {
            return false;
        }

        for (let i = 0; i < list1.length; i++) {
            const val1 = ignoreCase ? list1[i].toLowerCase() : list1[i];
            const val2 = ignoreCase ? list2[i].toLowerCase() : list2[i];

            if (val1 !== val2) {
                return false;
            }
        }

        return true;
    }
}

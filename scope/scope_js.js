/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
class Scope {
    constructor(lowerObj, upperObj) {
        this.lowerObj = lowerObj;
        this.upperObj = upperObj;
        this.checkNull(lowerObj, 'lower limit not be null');
        this.checkNull(upperObj, 'upper limit not be null');
        if (lowerObj.compareTo(upperObj)) {
            throw new Error('lower limit must be less than or equal to upper limit');
        }
        this._lowerLimit = lowerObj;
        this._upperLimit = upperObj;
    }

    getLower() {
        return this._lowerLimit;
    }

    getUpper() {
        return this._upperLimit;
    }

    contains(x) {
        let resLower;
        let resUpper;
        this.checkNull(x, 'value must not be null');
        if (x instanceof Scope) {
            resLower = x._lowerLimit.compareTo(this._lowerLimit);
            resUpper = this._upperLimit.compareTo(x._upperLimit);
        } else {
            resLower = x.compareTo(this._lowerLimit);
            resUpper = this._upperLimit.compareTo(x);
        }
        return resLower && resUpper;
    }

    clamp(value) {
        this.checkNull(value, 'value must not be null');
        if (!value.compareTo(this._lowerLimit)) {
            return this._lowerLimit;
        } else if (value.compareTo(this._upperLimit)) {
            return this._upperLimit;
        } else {
            return value;
        }
    }

    intersect(x, y) {
        let reLower;
        let reUpper;
        let mLower;
        let mUpper;
        if (y) {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, 'upper limit must not be null');
            reLower = this._lowerLimit.compareTo(x);
            reUpper = y.compareTo(this._upperLimit);
            if (reLower && reUpper) {
                return this;
            } else {
                mLower = reLower ? this._lowerLimit : x;
                mUpper = reUpper ? this._upperLimit : y;
                return new Scope(mLower, mUpper);
            }
        } else {
            this.checkNull(x, 'scope must not be null');
            reLower = this._lowerLimit.compareTo(x._lowerLimit);
            reUpper = x._upperLimit.compareTo(this._upperLimit);
            if (!reLower && !reUpper) {
                return x;
            } else if (reLower && reUpper) {
                return this;
            } else {
                mLower = reLower ? this._lowerLimit : x._lowerLimit;
                mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
            }
        }
    }

    expand(x, y) {
        let reLower;
        let reUpper;
        let mLower;
        let mUpper;
        if (!y) {
            this.checkNull(x, 'value must not be null');
            if (!(x instanceof Scope)) {
                this.checkNull(x, 'value must not be null');
                return this.expand(x, x);
            }
            let reLower = x._lowerLimit.compareTo(this._lowerLimit);
            let reUpper = this._upperLimit.compareTo(x._upperLimit);
            if (reLower && reUpper) {
                return this;
            } else if (!reLower && !reUpper) {
                return x;
            } else {
                let mLower = reLower ? this._lowerLimit : x._lowerLimit;
                let mUpper = reUpper ? this._upperLimit : x._upperLimit;
                return new Scope(mLower, mUpper);
            }
        }
        else {
            this.checkNull(x, 'lower limit must not be null');
            this.checkNull(y, 'upper limit must not be null');
            let reLower = x.compareTo(this._lowerLimit);
            let reUpper = this._upperLimit.compareTo(y);
            if (reLower && reUpper) {
                return this;
            }
            let mLower = reLower ? this._lowerLimit : x;
            let mUpper = reUpper ? this._upperLimit : y;
            return new Scope(mLower, mUpper);
        }
    }

    toString() {
        let strLower = this._lowerLimit.toString();
        let strUpper = this._upperLimit.toString();
        return `[${strLower}, ${strUpper}]`;
    }

    checkNull(o, str) {
        if (o == null) {
            throw new Error(str);
        }
    }
}

export default {
    Scope: Scope,
};
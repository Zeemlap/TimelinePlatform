﻿(function () {

    var pow = Math.pow;
    function Ieee754FloatingPointUtilities(mantNoBits, expNoBits) {
        if (!isIntegralDouble(mantNoBits) || mantNoBits < 0 || 52 < mantNoBits) throw Error();
        if (!isIntegralDouble(mantNoBits) || expNoBits < 0 || 11 < expNoBits) throw Error();
        this.__mantNoBits = mantNoBits;
        this.__expNoBits = expNoBits;
        this.__expBias = (1 << (this.__expNoBits - 1)) - 1;
        this.__expMax = (1 << this.__expNoBits) - 1 - this.__expBias;
    }
    Ieee754FloatingPointUtilities.prototype = {
        getMantissaSize_base2: function () {
            return this.__mantNoBits;
        },
        getExponentSize_base2: function () {
            return this.__expNoBits;
        },
        getExponentMin: function () {
            return -this.__expBias;
        },
        getExponentMax: function () {
            return this.__expMax;
        },
        getExponentBias: function () {
            return this.__expBias;
        },
        getExponent: function (value) {
            throw Error();
        },
        create: function (exponent, mantissa, isNegative) {
            throw Error();
        }
    };

    function __DoubleUtilities() {
        Ieee754FloatingPointUtilities.call(this, 52, 11);

        this.__2PowMantNoBits = pow(2, this.getMantissaSize_base2());
        this.__minNormalizedV = pow(2, this.getExponentMin() + 1);
        this.__arrE = [512, 256, 128, 64, 32, 16, 8, 4, 2, 1];
        var arrE_len = this.__arrE.length;
        this.__arr2PowE = new Array(arrE_len);
        for (var i = 0; i < arrE_len; ++i) {
            this.__arr2PowE[i] = pow(2, this.__arrE[i]);
        }
        this.__mantMax = this.__2PowMantNoBits - 1;
    }
    function DoubleUtilities() {
        throw Error();
    }
    DoubleUtilities.prototype = __DoubleUtilities.prototype = setOwnSrcPropsOnDst({
        create: function (exponent, mantissa, isNegative) {
            var expMin;
            var expMax;
            if (exponent < (expMin = this.getExponentMin())
                || (expMax = this.getExponentMax()) < exponent
                || !isIntegralDouble(exponent)) {
                throw Error();
            }
            if (mantissa < 0 || this.__mantMax < mantissa || !isIntegralDouble(mantissa)) {
                throw Error();
            }
            if (arguments.length < 3) {
                isNegative = false;
            } else if (typeof isNegative !== "boolean") {
                throw Error();
            }
            var n;
            if (exponent === expMax) {
                if (mantissa === 0) {
                    n = 1 / 0;
                } else {
                    n = 0 / 0;
                }
            } else {
                n = (mantissa + (exponent !== expMin ? this.__2PowMantNoBits : 0)) * pow(2, exponent - this.getMantissaSize_base2());
            }
            if (isNegative) {
                n = -n;
            }
            return n;
        },

        getExponent: function (v1) {
            if (typeof v1 !== "number") {
                throw Error();
            }
            if (!isFinite(v1)) {
                return this.getExponentMax();
            }
            if (v1 < 0) {
                v1 = -v1;
            }
            if (v1 < this.__minNormalizedV) {
                return this.getExponentMin();
            }
            var v2, i = 0, e = 0;
            var arrE = this.__arrE;
            var arrE_len = arrE.length;
            var arr2PowE = this.__arr2PowE;
            if (v1 < 1) {
                for (; i < arrE_len; ++i) {
                    v2 = v1 * arr2PowE[i];
                    if (v2 < 2) {
                        v1 = v2;
                        e -= arrE[i];
                    }
                }
            } else {
                for (; i < arrE_len; ++i) {
                    v2 = arr2PowE[i];
                    if (v2 <= v1) {
                        v1 /= v2;
                        e += arrE[i];
                    }
                }
            }
            return e;
        }
    }, Object.create(Ieee754FloatingPointUtilities.prototype));

    var doubleUtilities = new __DoubleUtilities();
    DoubleUtilities.getInstance = function () { return doubleUtilities; };

    // This operation is equivalent to floor(log2(v1)), but this implementation is guaranteed to be correct for all doubles (100% accuracy).
    // Furthermore, this implementation throws an error for non-positive and non-finite v1 (for which log2 is mathematically undefined).
    function log2FloorDouble(x) {
        var exp, mant;
        if (!isFiniteDouble(x) || x <= 0) throw Error();
        if (x < 2) return 0;
        exp = doubleUtilities.getExponent(x);
        return exp;
    }
    setOwnSrcPropsOnDst({
        Ieee754FloatingPointUtilities: Ieee754FloatingPointUtilities,
        DoubleUtilities: DoubleUtilities,
        log2FloorDouble: log2FloorDouble
    }, window);

})();
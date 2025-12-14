"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
var typeorm_1 = require("typeorm");
var Listing = function () {
    var _classDecorators = [(0, typeorm_1.Entity)({ name: 'listings' })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _make_decorators;
    var _make_initializers = [];
    var _make_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _mileage_decorators;
    var _mileage_initializers = [];
    var _mileage_extraInitializers = [];
    var _damageType_decorators;
    var _damageType_initializers = [];
    var _damageType_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _legalStatus_decorators;
    var _legalStatus_initializers = [];
    var _legalStatus_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    var _whatsapp_decorators;
    var _whatsapp_initializers = [];
    var _whatsapp_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var Listing = _classThis = /** @class */ (function () {
        function Listing_1() {
            this.id = __runInitializers(this, _id_initializers, void 0); // يطابق id: number في التطبيق
            this.make = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _make_initializers, void 0));
            this.model = (__runInitializers(this, _make_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.price = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.city = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _city_initializers, void 0));
            this.mileage = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _mileage_initializers, void 0));
            this.damageType = (__runInitializers(this, _mileage_extraInitializers), __runInitializers(this, _damageType_initializers, void 0));
            this.description = (__runInitializers(this, _damageType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.legalStatus = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _legalStatus_initializers, void 0));
            this.vin = (__runInitializers(this, _legalStatus_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
            this.whatsapp = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _whatsapp_initializers, void 0));
            // نخزن الصور كمصفوفة بسيطة
            this.images = (__runInitializers(this, _whatsapp_extraInitializers), __runInitializers(this, _images_initializers, void 0)); // ["https://url1.jpg","https://url2.jpg"]
            __runInitializers(this, _images_extraInitializers);
        }
        return Listing_1;
    }());
    __setFunctionName(_classThis, "Listing");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _make_decorators = [(0, typeorm_1.Column)()];
        _model_decorators = [(0, typeorm_1.Column)()];
        _year_decorators = [(0, typeorm_1.Column)()];
        _price_decorators = [(0, typeorm_1.Column)('numeric', { precision: 12, scale: 2 })];
        _city_decorators = [(0, typeorm_1.Column)()];
        _mileage_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _damageType_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _description_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _legalStatus_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _vin_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _whatsapp_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _images_decorators = [(0, typeorm_1.Column)('simple-array', { nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _make_decorators, { kind: "field", name: "make", static: false, private: false, access: { has: function (obj) { return "make" in obj; }, get: function (obj) { return obj.make; }, set: function (obj, value) { obj.make = value; } }, metadata: _metadata }, _make_initializers, _make_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
        __esDecorate(null, null, _mileage_decorators, { kind: "field", name: "mileage", static: false, private: false, access: { has: function (obj) { return "mileage" in obj; }, get: function (obj) { return obj.mileage; }, set: function (obj, value) { obj.mileage = value; } }, metadata: _metadata }, _mileage_initializers, _mileage_extraInitializers);
        __esDecorate(null, null, _damageType_decorators, { kind: "field", name: "damageType", static: false, private: false, access: { has: function (obj) { return "damageType" in obj; }, get: function (obj) { return obj.damageType; }, set: function (obj, value) { obj.damageType = value; } }, metadata: _metadata }, _damageType_initializers, _damageType_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _legalStatus_decorators, { kind: "field", name: "legalStatus", static: false, private: false, access: { has: function (obj) { return "legalStatus" in obj; }, get: function (obj) { return obj.legalStatus; }, set: function (obj, value) { obj.legalStatus = value; } }, metadata: _metadata }, _legalStatus_initializers, _legalStatus_extraInitializers);
        __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
        __esDecorate(null, null, _whatsapp_decorators, { kind: "field", name: "whatsapp", static: false, private: false, access: { has: function (obj) { return "whatsapp" in obj; }, get: function (obj) { return obj.whatsapp; }, set: function (obj, value) { obj.whatsapp = value; } }, metadata: _metadata }, _whatsapp_initializers, _whatsapp_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Listing = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Listing = _classThis;
}();
exports.Listing = Listing;

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
exports.VinRecord = void 0;
var typeorm_1 = require("typeorm");
var vin_image_entity_1 = require("./vin-image.entity");
var VinRecord = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _vin_decorators;
    var _vin_initializers = [];
    var _vin_extraInitializers = [];
    var _make_decorators;
    var _make_initializers = [];
    var _make_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _auction_name_decorators;
    var _auction_name_initializers = [];
    var _auction_name_extraInitializers = [];
    var _lot_number_decorators;
    var _lot_number_initializers = [];
    var _lot_number_extraInitializers = [];
    var _sold_price_decorators;
    var _sold_price_initializers = [];
    var _sold_price_extraInitializers = [];
    var _damage_type_decorators;
    var _damage_type_initializers = [];
    var _damage_type_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    var VinRecord = _classThis = /** @class */ (function () {
        function VinRecord_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.vin = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _vin_initializers, void 0));
            this.make = (__runInitializers(this, _vin_extraInitializers), __runInitializers(this, _make_initializers, void 0));
            this.model = (__runInitializers(this, _make_extraInitializers), __runInitializers(this, _model_initializers, void 0));
            this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
            this.auction_name = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _auction_name_initializers, void 0));
            this.lot_number = (__runInitializers(this, _auction_name_extraInitializers), __runInitializers(this, _lot_number_initializers, void 0));
            this.sold_price = (__runInitializers(this, _lot_number_extraInitializers), __runInitializers(this, _sold_price_initializers, void 0));
            this.damage_type = (__runInitializers(this, _sold_price_extraInitializers), __runInitializers(this, _damage_type_initializers, void 0));
            this.images = (__runInitializers(this, _damage_type_extraInitializers), __runInitializers(this, _images_initializers, void 0));
            __runInitializers(this, _images_extraInitializers);
        }
        return VinRecord_1;
    }());
    __setFunctionName(_classThis, "VinRecord");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _vin_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _make_decorators = [(0, typeorm_1.Column)()];
        _model_decorators = [(0, typeorm_1.Column)()];
        _year_decorators = [(0, typeorm_1.Column)()];
        _auction_name_decorators = [(0, typeorm_1.Column)()];
        _lot_number_decorators = [(0, typeorm_1.Column)()];
        _sold_price_decorators = [(0, typeorm_1.Column)()];
        _damage_type_decorators = [(0, typeorm_1.Column)()];
        _images_decorators = [(0, typeorm_1.OneToMany)(function () { return vin_image_entity_1.VinImage; }, function (img) { return img.vinRecord; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _vin_decorators, { kind: "field", name: "vin", static: false, private: false, access: { has: function (obj) { return "vin" in obj; }, get: function (obj) { return obj.vin; }, set: function (obj, value) { obj.vin = value; } }, metadata: _metadata }, _vin_initializers, _vin_extraInitializers);
        __esDecorate(null, null, _make_decorators, { kind: "field", name: "make", static: false, private: false, access: { has: function (obj) { return "make" in obj; }, get: function (obj) { return obj.make; }, set: function (obj, value) { obj.make = value; } }, metadata: _metadata }, _make_initializers, _make_extraInitializers);
        __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
        __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
        __esDecorate(null, null, _auction_name_decorators, { kind: "field", name: "auction_name", static: false, private: false, access: { has: function (obj) { return "auction_name" in obj; }, get: function (obj) { return obj.auction_name; }, set: function (obj, value) { obj.auction_name = value; } }, metadata: _metadata }, _auction_name_initializers, _auction_name_extraInitializers);
        __esDecorate(null, null, _lot_number_decorators, { kind: "field", name: "lot_number", static: false, private: false, access: { has: function (obj) { return "lot_number" in obj; }, get: function (obj) { return obj.lot_number; }, set: function (obj, value) { obj.lot_number = value; } }, metadata: _metadata }, _lot_number_initializers, _lot_number_extraInitializers);
        __esDecorate(null, null, _sold_price_decorators, { kind: "field", name: "sold_price", static: false, private: false, access: { has: function (obj) { return "sold_price" in obj; }, get: function (obj) { return obj.sold_price; }, set: function (obj, value) { obj.sold_price = value; } }, metadata: _metadata }, _sold_price_initializers, _sold_price_extraInitializers);
        __esDecorate(null, null, _damage_type_decorators, { kind: "field", name: "damage_type", static: false, private: false, access: { has: function (obj) { return "damage_type" in obj; }, get: function (obj) { return obj.damage_type; }, set: function (obj, value) { obj.damage_type = value; } }, metadata: _metadata }, _damage_type_initializers, _damage_type_extraInitializers);
        __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VinRecord = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VinRecord = _classThis;
}();
exports.VinRecord = VinRecord;

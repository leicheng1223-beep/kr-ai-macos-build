import { execFile as e } from "node:child_process";
import t from "node:fs";
import n from "node:path";
import { promisify as r } from "node:util";
import { BrowserWindow as i, Menu as a, app as o, dialog as s, ipcMain as c, nativeImage as l, net as u, session as d, shell as f } from "electron";
import { fileURLToPath, pathToFileURL as p } from "node:url";
import m from "better-sqlite3";
Object.freeze({ status: "aborted" });
function h(e, t, n) {
	function r(n, r) {
		if (n._zod || Object.defineProperty(n, "_zod", {
			value: {
				def: r,
				constr: o,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: !1
		}), n._zod.traits.has(e)) return;
		n._zod.traits.add(e), t(n, r);
		let i = o.prototype, a = Object.keys(i);
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			t in n || (n[t] = i[t].bind(n));
		}
	}
	let i = n?.Parent ?? Object;
	class a extends i {}
	Object.defineProperty(a, "name", { value: e });
	function o(e) {
		var t;
		let i = n?.Parent ? new a() : this;
		r(i, e), (t = i._zod).deferred ?? (t.deferred = []);
		for (let e of i._zod.deferred) e();
		return i;
	}
	return Object.defineProperty(o, "init", { value: r }), Object.defineProperty(o, Symbol.hasInstance, { value: (t) => n?.Parent && t instanceof n.Parent ? !0 : t?._zod?.traits?.has(e) }), Object.defineProperty(o, "name", { value: e }), o;
}
var g = class extends Error {
	constructor() {
		super("Encountered Promise during synchronous parse. Use .parseAsync() instead.");
	}
}, ee = class extends Error {
	constructor(e) {
		super(`Encountered unidirectional transform during encode: ${e}`), this.name = "ZodEncodeError";
	}
}, te = {};
function _(e) {
	return e && Object.assign(te, e), te;
}
//#endregion
//#region node_modules/zod/v4/core/util.js
function ne(e) {
	let t = Object.values(e).filter((e) => typeof e == "number");
	return Object.entries(e).filter(([e, n]) => t.indexOf(+e) === -1).map(([e, t]) => t);
}
function re(e, t) {
	return typeof t == "bigint" ? t.toString() : t;
}
function ie(e) {
	return { get value() {
		{
			let t = e();
			return Object.defineProperty(this, "value", { value: t }), t;
		}
		throw Error("cached value already set");
	} };
}
function ae(e) {
	return e == null;
}
function oe(e) {
	let t = e.startsWith("^") ? 1 : 0, n = e.endsWith("$") ? e.length - 1 : e.length;
	return e.slice(t, n);
}
function se(e, t) {
	let n = (e.toString().split(".")[1] || "").length, r = t.toString(), i = (r.split(".")[1] || "").length;
	if (i === 0 && /\d?e-\d?/.test(r)) {
		let e = r.match(/\d?e-(\d?)/);
		e?.[1] && (i = Number.parseInt(e[1]));
	}
	let a = n > i ? n : i;
	return Number.parseInt(e.toFixed(a).replace(".", "")) % Number.parseInt(t.toFixed(a).replace(".", "")) / 10 ** a;
}
var ce = Symbol("evaluating");
function v(e, t, n) {
	let r;
	Object.defineProperty(e, t, {
		get() {
			if (r !== ce) return r === void 0 && (r = ce, r = n()), r;
		},
		set(n) {
			Object.defineProperty(e, t, { value: n });
		},
		configurable: !0
	});
}
function y(e, t, n) {
	Object.defineProperty(e, t, {
		value: n,
		writable: !0,
		enumerable: !0,
		configurable: !0
	});
}
function b(...e) {
	let t = {};
	for (let n of e) Object.assign(t, Object.getOwnPropertyDescriptors(n));
	return Object.defineProperties({}, t);
}
function le(e) {
	return JSON.stringify(e);
}
function ue(e) {
	return e.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var de = "captureStackTrace" in Error ? Error.captureStackTrace : (...e) => {};
function fe(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
var pe = ie(() => {
	if (typeof navigator < "u" && navigator?.userAgent?.includes("Cloudflare")) return !1;
	try {
		return Function(""), !0;
	} catch {
		return !1;
	}
});
function x(e) {
	if (fe(e) === !1) return !1;
	let t = e.constructor;
	if (t === void 0 || typeof t != "function") return !0;
	let n = t.prototype;
	return !(fe(n) === !1 || Object.prototype.hasOwnProperty.call(n, "isPrototypeOf") === !1);
}
function me(e) {
	return x(e) ? { ...e } : Array.isArray(e) ? [...e] : e;
}
var he = new Set([
	"string",
	"number",
	"symbol"
]);
function S(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function C(e, t, n) {
	let r = new e._zod.constr(t ?? e._zod.def);
	return (!t || n?.parent) && (r._zod.parent = e), r;
}
function w(e) {
	let t = e;
	if (!t) return {};
	if (typeof t == "string") return { error: () => t };
	if (t?.message !== void 0) {
		if (t?.error !== void 0) throw Error("Cannot specify both `message` and `error` params");
		t.error = t.message;
	}
	return delete t.message, typeof t.error == "string" ? {
		...t,
		error: () => t.error
	} : t;
}
function ge(e) {
	return Object.keys(e).filter((t) => e[t]._zod.optin === "optional" && e[t]._zod.optout === "optional");
}
var _e = {
	safeint: [-(2 ** 53 - 1), 2 ** 53 - 1],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function ve(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".pick() cannot be used on object schemas containing refinements");
	return C(e, b(e._zod.def, {
		get shape() {
			let e = {};
			for (let r in t) {
				if (!(r in n.shape)) throw Error(`Unrecognized key: "${r}"`);
				t[r] && (e[r] = n.shape[r]);
			}
			return y(this, "shape", e), e;
		},
		checks: []
	}));
}
function ye(e, t) {
	let n = e._zod.def, r = n.checks;
	if (r && r.length > 0) throw Error(".omit() cannot be used on object schemas containing refinements");
	return C(e, b(e._zod.def, {
		get shape() {
			let r = { ...e._zod.def.shape };
			for (let e in t) {
				if (!(e in n.shape)) throw Error(`Unrecognized key: "${e}"`);
				t[e] && delete r[e];
			}
			return y(this, "shape", r), r;
		},
		checks: []
	}));
}
function be(e, t) {
	if (!x(t)) throw Error("Invalid input to extend: expected a plain object");
	let n = e._zod.def.checks;
	if (n && n.length > 0) {
		let n = e._zod.def.shape;
		for (let e in t) if (Object.getOwnPropertyDescriptor(n, e) !== void 0) throw Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return C(e, b(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return y(this, "shape", n), n;
	} }));
}
function xe(e, t) {
	if (!x(t)) throw Error("Invalid input to safeExtend: expected a plain object");
	return C(e, b(e._zod.def, { get shape() {
		let n = {
			...e._zod.def.shape,
			...t
		};
		return y(this, "shape", n), n;
	} }));
}
function Se(e, t) {
	return C(e, b(e._zod.def, {
		get shape() {
			let n = {
				...e._zod.def.shape,
				...t._zod.def.shape
			};
			return y(this, "shape", n), n;
		},
		get catchall() {
			return t._zod.def.catchall;
		},
		checks: []
	}));
}
function Ce(e, t, n) {
	let r = t._zod.def.checks;
	if (r && r.length > 0) throw Error(".partial() cannot be used on object schemas containing refinements");
	return C(t, b(t._zod.def, {
		get shape() {
			let r = t._zod.def.shape, i = { ...r };
			if (n) for (let t in n) {
				if (!(t in r)) throw Error(`Unrecognized key: "${t}"`);
				n[t] && (i[t] = e ? new e({
					type: "optional",
					innerType: r[t]
				}) : r[t]);
			}
			else for (let t in r) i[t] = e ? new e({
				type: "optional",
				innerType: r[t]
			}) : r[t];
			return y(this, "shape", i), i;
		},
		checks: []
	}));
}
function we(e, t, n) {
	return C(t, b(t._zod.def, { get shape() {
		let r = t._zod.def.shape, i = { ...r };
		if (n) for (let t in n) {
			if (!(t in i)) throw Error(`Unrecognized key: "${t}"`);
			n[t] && (i[t] = new e({
				type: "nonoptional",
				innerType: r[t]
			}));
		}
		else for (let t in r) i[t] = new e({
			type: "nonoptional",
			innerType: r[t]
		});
		return y(this, "shape", i), i;
	} }));
}
function T(e, t = 0) {
	if (e.aborted === !0) return !0;
	for (let n = t; n < e.issues.length; n++) if (e.issues[n]?.continue !== !0) return !0;
	return !1;
}
function E(e, t) {
	return t.map((t) => {
		var n;
		return (n = t).path ?? (n.path = []), t.path.unshift(e), t;
	});
}
function Te(e) {
	return typeof e == "string" ? e : e?.message;
}
function D(e, t, n) {
	let r = {
		...e,
		path: e.path ?? []
	};
	return e.message || (r.message = Te(e.inst?._zod.def?.error?.(e)) ?? Te(t?.error?.(e)) ?? Te(n.customError?.(e)) ?? Te(n.localeError?.(e)) ?? "Invalid input"), delete r.inst, delete r.continue, t?.reportInput || delete r.input, r;
}
function Ee(e) {
	return Array.isArray(e) ? "array" : typeof e == "string" ? "string" : "unknown";
}
function O(...e) {
	let [t, n, r] = e;
	return typeof t == "string" ? {
		message: t,
		code: "custom",
		input: n,
		inst: r
	} : { ...t };
}
//#endregion
//#region node_modules/zod/v4/core/errors.js
var De = (e, t) => {
	e.name = "$ZodError", Object.defineProperty(e, "_zod", {
		value: e._zod,
		enumerable: !1
	}), Object.defineProperty(e, "issues", {
		value: t,
		enumerable: !1
	}), e.message = JSON.stringify(t, re, 2), Object.defineProperty(e, "toString", {
		value: () => e.message,
		enumerable: !1
	});
}, Oe = h("$ZodError", De), ke = h("$ZodError", De, { Parent: Error });
function Ae(e, t = (e) => e.message) {
	let n = {}, r = [];
	for (let i of e.issues) i.path.length > 0 ? (n[i.path[0]] = n[i.path[0]] || [], n[i.path[0]].push(t(i))) : r.push(t(i));
	return {
		formErrors: r,
		fieldErrors: n
	};
}
function je(e, t = (e) => e.message) {
	let n = { _errors: [] }, r = (e) => {
		for (let i of e.issues) if (i.code === "invalid_union" && i.errors.length) i.errors.map((e) => r({ issues: e }));
		else if (i.code === "invalid_key") r({ issues: i.issues });
		else if (i.code === "invalid_element") r({ issues: i.issues });
		else if (i.path.length === 0) n._errors.push(t(i));
		else {
			let e = n, r = 0;
			for (; r < i.path.length;) {
				let n = i.path[r];
				r === i.path.length - 1 ? (e[n] = e[n] || { _errors: [] }, e[n]._errors.push(t(i))) : e[n] = e[n] || { _errors: [] }, e = e[n], r++;
			}
		}
	};
	return r(e), n;
}
//#endregion
//#region node_modules/zod/v4/core/parse.js
var Me = (e) => (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !1 }) : { async: !1 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise) throw new g();
	if (o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => D(e, a, _())));
		throw de(t, i?.callee), t;
	}
	return o.value;
}, Ne = (e) => async (t, n, r, i) => {
	let a = r ? Object.assign(r, { async: !0 }) : { async: !0 }, o = t._zod.run({
		value: n,
		issues: []
	}, a);
	if (o instanceof Promise && (o = await o), o.issues.length) {
		let t = new (i?.Err ?? e)(o.issues.map((e) => D(e, a, _())));
		throw de(t, i?.callee), t;
	}
	return o.value;
}, Pe = (e) => (t, n, r) => {
	let i = r ? {
		...r,
		async: !1
	} : { async: !1 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	if (a instanceof Promise) throw new g();
	return a.issues.length ? {
		success: !1,
		error: new (e ?? Oe)(a.issues.map((e) => D(e, i, _())))
	} : {
		success: !0,
		data: a.value
	};
}, Fe = /* @__PURE__ */ Pe(ke), Ie = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { async: !0 }) : { async: !0 }, a = t._zod.run({
		value: n,
		issues: []
	}, i);
	return a instanceof Promise && (a = await a), a.issues.length ? {
		success: !1,
		error: new e(a.issues.map((e) => D(e, i, _())))
	} : {
		success: !0,
		data: a.value
	};
}, Le = /* @__PURE__ */ Ie(ke), Re = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return Me(e)(t, n, i);
}, ze = (e) => (t, n, r) => Me(e)(t, n, r), Be = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return Ne(e)(t, n, i);
}, Ve = (e) => async (t, n, r) => Ne(e)(t, n, r), He = (e) => (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return Pe(e)(t, n, i);
}, Ue = (e) => (t, n, r) => Pe(e)(t, n, r), We = (e) => async (t, n, r) => {
	let i = r ? Object.assign(r, { direction: "backward" }) : { direction: "backward" };
	return Ie(e)(t, n, i);
}, Ge = (e) => async (t, n, r) => Ie(e)(t, n, r), Ke = /^[cC][^\s-]{8,}$/, qe = /^[0-9a-z]+$/, Je = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/, Ye = /^[0-9a-vA-V]{20}$/, Xe = /^[A-Za-z0-9]{27}$/, Ze = /^[a-zA-Z0-9_-]{21}$/, Qe = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/, $e = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/, et = (e) => e ? RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`) : /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/, tt = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/, nt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
function rt() {
	return new RegExp(nt, "u");
}
var it = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, at = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/, ot = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/, st = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, ct = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/, lt = /^[A-Za-z0-9_-]*$/, ut = /^\+[1-9]\d{6,14}$/, dt = "(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))", ft = /* @__PURE__ */ RegExp(`^${dt}$`);
function pt(e) {
	let t = "(?:[01]\\d|2[0-3]):[0-5]\\d";
	return typeof e.precision == "number" ? e.precision === -1 ? `${t}` : e.precision === 0 ? `${t}:[0-5]\\d` : `${t}:[0-5]\\d\\.\\d{${e.precision}}` : `${t}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function mt(e) {
	return RegExp(`^${pt(e)}$`);
}
function ht(e) {
	let t = pt({ precision: e.precision }), n = ["Z"];
	e.local && n.push(""), e.offset && n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");
	let r = `${t}(?:${n.join("|")})`;
	return RegExp(`^${dt}T(?:${r})$`);
}
var gt = (e) => {
	let t = e ? `[\\s\\S]{${e?.minimum ?? 0},${e?.maximum ?? ""}}` : "[\\s\\S]*";
	return RegExp(`^${t}$`);
}, _t = /^-?\d+$/, vt = /^-?\d+(?:\.\d+)?$/, yt = /^(?:true|false)$/i, bt = /^[^A-Z]*$/, xt = /^[^a-z]*$/, k = /* @__PURE__ */ h("$ZodCheck", (e, t) => {
	var n;
	e._zod ??= {}, e._zod.def = t, (n = e._zod).onattach ?? (n.onattach = []);
}), St = {
	number: "number",
	bigint: "bigint",
	object: "date"
}, Ct = /* @__PURE__ */ h("$ZodCheckLessThan", (e, t) => {
	k.init(e, t);
	let n = St[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.maximum : n.exclusiveMaximum) ?? Infinity;
		t.value < r && (t.inclusive ? n.maximum = t.value : n.exclusiveMaximum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value <= t.value : r.value < t.value) || r.issues.push({
			origin: n,
			code: "too_big",
			maximum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), wt = /* @__PURE__ */ h("$ZodCheckGreaterThan", (e, t) => {
	k.init(e, t);
	let n = St[typeof t.value];
	e._zod.onattach.push((e) => {
		let n = e._zod.bag, r = (t.inclusive ? n.minimum : n.exclusiveMinimum) ?? -Infinity;
		t.value > r && (t.inclusive ? n.minimum = t.value : n.exclusiveMinimum = t.value);
	}), e._zod.check = (r) => {
		(t.inclusive ? r.value >= t.value : r.value > t.value) || r.issues.push({
			origin: n,
			code: "too_small",
			minimum: typeof t.value == "object" ? t.value.getTime() : t.value,
			input: r.value,
			inclusive: t.inclusive,
			inst: e,
			continue: !t.abort
		});
	};
}), Tt = /* @__PURE__ */ h("$ZodCheckMultipleOf", (e, t) => {
	k.init(e, t), e._zod.onattach.push((e) => {
		var n;
		(n = e._zod.bag).multipleOf ?? (n.multipleOf = t.value);
	}), e._zod.check = (n) => {
		if (typeof n.value != typeof t.value) throw Error("Cannot mix number and bigint in multiple_of check.");
		(typeof n.value == "bigint" ? n.value % t.value === BigInt(0) : se(n.value, t.value) === 0) || n.issues.push({
			origin: typeof n.value,
			code: "not_multiple_of",
			divisor: t.value,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Et = /* @__PURE__ */ h("$ZodCheckNumberFormat", (e, t) => {
	k.init(e, t), t.format = t.format || "float64";
	let n = t.format?.includes("int"), r = n ? "int" : "number", [i, a] = _e[t.format];
	e._zod.onattach.push((e) => {
		let r = e._zod.bag;
		r.format = t.format, r.minimum = i, r.maximum = a, n && (r.pattern = _t);
	}), e._zod.check = (o) => {
		let s = o.value;
		if (n) {
			if (!Number.isInteger(s)) {
				o.issues.push({
					expected: r,
					format: t.format,
					code: "invalid_type",
					continue: !1,
					input: s,
					inst: e
				});
				return;
			}
			if (!Number.isSafeInteger(s)) {
				s > 0 ? o.issues.push({
					input: s,
					code: "too_big",
					maximum: 2 ** 53 - 1,
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				}) : o.issues.push({
					input: s,
					code: "too_small",
					minimum: -(2 ** 53 - 1),
					note: "Integers must be within the safe integer range.",
					inst: e,
					origin: r,
					inclusive: !0,
					continue: !t.abort
				});
				return;
			}
		}
		s < i && o.issues.push({
			origin: "number",
			input: s,
			code: "too_small",
			minimum: i,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		}), s > a && o.issues.push({
			origin: "number",
			input: s,
			code: "too_big",
			maximum: a,
			inclusive: !0,
			inst: e,
			continue: !t.abort
		});
	};
}), Dt = /* @__PURE__ */ h("$ZodCheckMaxLength", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ae(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.maximum ?? Infinity;
		t.maximum < n && (e._zod.bag.maximum = t.maximum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length <= t.maximum) return;
		let i = Ee(r);
		n.issues.push({
			origin: i,
			code: "too_big",
			maximum: t.maximum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), Ot = /* @__PURE__ */ h("$ZodCheckMinLength", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ae(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag.minimum ?? -Infinity;
		t.minimum > n && (e._zod.bag.minimum = t.minimum);
	}), e._zod.check = (n) => {
		let r = n.value;
		if (r.length >= t.minimum) return;
		let i = Ee(r);
		n.issues.push({
			origin: i,
			code: "too_small",
			minimum: t.minimum,
			inclusive: !0,
			input: r,
			inst: e,
			continue: !t.abort
		});
	};
}), kt = /* @__PURE__ */ h("$ZodCheckLengthEquals", (e, t) => {
	var n;
	k.init(e, t), (n = e._zod.def).when ?? (n.when = (e) => {
		let t = e.value;
		return !ae(t) && t.length !== void 0;
	}), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.minimum = t.length, n.maximum = t.length, n.length = t.length;
	}), e._zod.check = (n) => {
		let r = n.value, i = r.length;
		if (i === t.length) return;
		let a = Ee(r), o = i > t.length;
		n.issues.push({
			origin: a,
			...o ? {
				code: "too_big",
				maximum: t.length
			} : {
				code: "too_small",
				minimum: t.length
			},
			inclusive: !0,
			exact: !0,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), At = /* @__PURE__ */ h("$ZodCheckStringFormat", (e, t) => {
	var n, r;
	k.init(e, t), e._zod.onattach.push((e) => {
		let n = e._zod.bag;
		n.format = t.format, t.pattern && (n.patterns ??= /* @__PURE__ */ new Set(), n.patterns.add(t.pattern));
	}), t.pattern ? (n = e._zod).check ?? (n.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: t.format,
			input: n.value,
			...t.pattern ? { pattern: t.pattern.toString() } : {},
			inst: e,
			continue: !t.abort
		});
	}) : (r = e._zod).check ?? (r.check = () => {});
}), jt = /* @__PURE__ */ h("$ZodCheckRegex", (e, t) => {
	At.init(e, t), e._zod.check = (n) => {
		t.pattern.lastIndex = 0, !t.pattern.test(n.value) && n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: n.value,
			pattern: t.pattern.toString(),
			inst: e,
			continue: !t.abort
		});
	};
}), Mt = /* @__PURE__ */ h("$ZodCheckLowerCase", (e, t) => {
	t.pattern ??= bt, At.init(e, t);
}), Nt = /* @__PURE__ */ h("$ZodCheckUpperCase", (e, t) => {
	t.pattern ??= xt, At.init(e, t);
}), Pt = /* @__PURE__ */ h("$ZodCheckIncludes", (e, t) => {
	k.init(e, t);
	let n = S(t.includes), r = new RegExp(typeof t.position == "number" ? `^.{${t.position}}${n}` : n);
	t.pattern = r, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(r);
	}), e._zod.check = (n) => {
		n.value.includes(t.includes, t.position) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: t.includes,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Ft = /* @__PURE__ */ h("$ZodCheckStartsWith", (e, t) => {
	k.init(e, t);
	let n = RegExp(`^${S(t.prefix)}.*`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.startsWith(t.prefix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: t.prefix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), It = /* @__PURE__ */ h("$ZodCheckEndsWith", (e, t) => {
	k.init(e, t);
	let n = RegExp(`.*${S(t.suffix)}$`);
	t.pattern ??= n, e._zod.onattach.push((e) => {
		let t = e._zod.bag;
		t.patterns ??= /* @__PURE__ */ new Set(), t.patterns.add(n);
	}), e._zod.check = (n) => {
		n.value.endsWith(t.suffix) || n.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: t.suffix,
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), Lt = /* @__PURE__ */ h("$ZodCheckOverwrite", (e, t) => {
	k.init(e, t), e._zod.check = (e) => {
		e.value = t.tx(e.value);
	};
}), Rt = class {
	constructor(e = []) {
		this.content = [], this.indent = 0, this && (this.args = e);
	}
	indented(e) {
		this.indent += 1, e(this), --this.indent;
	}
	write(e) {
		if (typeof e == "function") {
			e(this, { execution: "sync" }), e(this, { execution: "async" });
			return;
		}
		let t = e.split("\n").filter((e) => e), n = Math.min(...t.map((e) => e.length - e.trimStart().length)), r = t.map((e) => e.slice(n)).map((e) => " ".repeat(this.indent * 2) + e);
		for (let e of r) this.content.push(e);
	}
	compile() {
		let e = Function, t = this?.args, n = [...(this?.content ?? [""]).map((e) => `  ${e}`)];
		return new e(...t, n.join("\n"));
	}
}, zt = {
	major: 4,
	minor: 3,
	patch: 6
}, A = /* @__PURE__ */ h("$ZodType", (e, t) => {
	var n;
	e ??= {}, e._zod.def = t, e._zod.bag = e._zod.bag || {}, e._zod.version = zt;
	let r = [...e._zod.def.checks ?? []];
	e._zod.traits.has("$ZodCheck") && r.unshift(e);
	for (let t of r) for (let n of t._zod.onattach) n(e);
	if (r.length === 0) (n = e._zod).deferred ?? (n.deferred = []), e._zod.deferred?.push(() => {
		e._zod.run = e._zod.parse;
	});
	else {
		let t = (e, t, n) => {
			let r = T(e), i;
			for (let a of t) {
				if (a._zod.def.when) {
					if (!a._zod.def.when(e)) continue;
				} else if (r) continue;
				let t = e.issues.length, o = a._zod.check(e);
				if (o instanceof Promise && n?.async === !1) throw new g();
				if (i || o instanceof Promise) i = (i ?? Promise.resolve()).then(async () => {
					await o, e.issues.length !== t && (r ||= T(e, t));
				});
				else {
					if (e.issues.length === t) continue;
					r ||= T(e, t);
				}
			}
			return i ? i.then(() => e) : e;
		}, n = (n, i, a) => {
			if (T(n)) return n.aborted = !0, n;
			let o = t(i, r, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new g();
				return o.then((t) => e._zod.parse(t, a));
			}
			return e._zod.parse(o, a);
		};
		e._zod.run = (i, a) => {
			if (a.skipChecks) return e._zod.parse(i, a);
			if (a.direction === "backward") {
				let t = e._zod.parse({
					value: i.value,
					issues: []
				}, {
					...a,
					skipChecks: !0
				});
				return t instanceof Promise ? t.then((e) => n(e, i, a)) : n(t, i, a);
			}
			let o = e._zod.parse(i, a);
			if (o instanceof Promise) {
				if (a.async === !1) throw new g();
				return o.then((e) => t(e, r, a));
			}
			return t(o, r, a);
		};
	}
	v(e, "~standard", () => ({
		validate: (t) => {
			try {
				let n = Fe(e, t);
				return n.success ? { value: n.data } : { issues: n.error?.issues };
			} catch {
				return Le(e, t).then((e) => e.success ? { value: e.data } : { issues: e.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
}), Bt = /* @__PURE__ */ h("$ZodString", (e, t) => {
	A.init(e, t), e._zod.pattern = [...e?._zod.bag?.patterns ?? []].pop() ?? gt(e._zod.bag), e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = String(n.value);
		} catch {}
		return typeof n.value == "string" || n.issues.push({
			expected: "string",
			code: "invalid_type",
			input: n.value,
			inst: e
		}), n;
	};
}), j = /* @__PURE__ */ h("$ZodStringFormat", (e, t) => {
	At.init(e, t), Bt.init(e, t);
}), Vt = /* @__PURE__ */ h("$ZodGUID", (e, t) => {
	t.pattern ??= $e, j.init(e, t);
}), Ht = /* @__PURE__ */ h("$ZodUUID", (e, t) => {
	if (t.version) {
		let e = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[t.version];
		if (e === void 0) throw Error(`Invalid UUID version: "${t.version}"`);
		t.pattern ??= et(e);
	} else t.pattern ??= et();
	j.init(e, t);
}), Ut = /* @__PURE__ */ h("$ZodEmail", (e, t) => {
	t.pattern ??= tt, j.init(e, t);
}), Wt = /* @__PURE__ */ h("$ZodURL", (e, t) => {
	j.init(e, t), e._zod.check = (n) => {
		try {
			let r = n.value.trim(), i = new URL(r);
			t.hostname && (t.hostname.lastIndex = 0, t.hostname.test(i.hostname) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: t.hostname.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.protocol && (t.protocol.lastIndex = 0, t.protocol.test(i.protocol.endsWith(":") ? i.protocol.slice(0, -1) : i.protocol) || n.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: t.protocol.source,
				input: n.value,
				inst: e,
				continue: !t.abort
			})), t.normalize ? n.value = i.href : n.value = r;
			return;
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "url",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), Gt = /* @__PURE__ */ h("$ZodEmoji", (e, t) => {
	t.pattern ??= rt(), j.init(e, t);
}), Kt = /* @__PURE__ */ h("$ZodNanoID", (e, t) => {
	t.pattern ??= Ze, j.init(e, t);
}), qt = /* @__PURE__ */ h("$ZodCUID", (e, t) => {
	t.pattern ??= Ke, j.init(e, t);
}), Jt = /* @__PURE__ */ h("$ZodCUID2", (e, t) => {
	t.pattern ??= qe, j.init(e, t);
}), Yt = /* @__PURE__ */ h("$ZodULID", (e, t) => {
	t.pattern ??= Je, j.init(e, t);
}), Xt = /* @__PURE__ */ h("$ZodXID", (e, t) => {
	t.pattern ??= Ye, j.init(e, t);
}), Zt = /* @__PURE__ */ h("$ZodKSUID", (e, t) => {
	t.pattern ??= Xe, j.init(e, t);
}), Qt = /* @__PURE__ */ h("$ZodISODateTime", (e, t) => {
	t.pattern ??= ht(t), j.init(e, t);
}), $t = /* @__PURE__ */ h("$ZodISODate", (e, t) => {
	t.pattern ??= ft, j.init(e, t);
}), en = /* @__PURE__ */ h("$ZodISOTime", (e, t) => {
	t.pattern ??= mt(t), j.init(e, t);
}), tn = /* @__PURE__ */ h("$ZodISODuration", (e, t) => {
	t.pattern ??= Qe, j.init(e, t);
}), nn = /* @__PURE__ */ h("$ZodIPv4", (e, t) => {
	t.pattern ??= it, j.init(e, t), e._zod.bag.format = "ipv4";
}), rn = /* @__PURE__ */ h("$ZodIPv6", (e, t) => {
	t.pattern ??= at, j.init(e, t), e._zod.bag.format = "ipv6", e._zod.check = (n) => {
		try {
			new URL(`http://[${n.value}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
}), an = /* @__PURE__ */ h("$ZodCIDRv4", (e, t) => {
	t.pattern ??= ot, j.init(e, t);
}), on = /* @__PURE__ */ h("$ZodCIDRv6", (e, t) => {
	t.pattern ??= st, j.init(e, t), e._zod.check = (n) => {
		let r = n.value.split("/");
		try {
			if (r.length !== 2) throw Error();
			let [e, t] = r;
			if (!t) throw Error();
			let n = Number(t);
			if (`${n}` !== t || n < 0 || n > 128) throw Error();
			new URL(`http://[${e}]`);
		} catch {
			n.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: n.value,
				inst: e,
				continue: !t.abort
			});
		}
	};
});
function sn(e) {
	if (e === "") return !0;
	if (e.length % 4 != 0) return !1;
	try {
		return atob(e), !0;
	} catch {
		return !1;
	}
}
var cn = /* @__PURE__ */ h("$ZodBase64", (e, t) => {
	t.pattern ??= ct, j.init(e, t), e._zod.bag.contentEncoding = "base64", e._zod.check = (n) => {
		sn(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
});
function ln(e) {
	if (!lt.test(e)) return !1;
	let t = e.replace(/[-_]/g, (e) => e === "-" ? "+" : "/");
	return sn(t.padEnd(Math.ceil(t.length / 4) * 4, "="));
}
var un = /* @__PURE__ */ h("$ZodBase64URL", (e, t) => {
	t.pattern ??= lt, j.init(e, t), e._zod.bag.contentEncoding = "base64url", e._zod.check = (n) => {
		ln(n.value) || n.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), dn = /* @__PURE__ */ h("$ZodE164", (e, t) => {
	t.pattern ??= ut, j.init(e, t);
});
function fn(e, t = null) {
	try {
		let n = e.split(".");
		if (n.length !== 3) return !1;
		let [r] = n;
		if (!r) return !1;
		let i = JSON.parse(atob(r));
		return !("typ" in i && i?.typ !== "JWT" || !i.alg || t && (!("alg" in i) || i.alg !== t));
	} catch {
		return !1;
	}
}
var pn = /* @__PURE__ */ h("$ZodJWT", (e, t) => {
	j.init(e, t), e._zod.check = (n) => {
		fn(n.value, t.alg) || n.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: n.value,
			inst: e,
			continue: !t.abort
		});
	};
}), mn = /* @__PURE__ */ h("$ZodNumber", (e, t) => {
	A.init(e, t), e._zod.pattern = e._zod.bag.pattern ?? vt, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = Number(n.value);
		} catch {}
		let i = n.value;
		if (typeof i == "number" && !Number.isNaN(i) && Number.isFinite(i)) return n;
		let a = typeof i == "number" ? Number.isNaN(i) ? "NaN" : Number.isFinite(i) ? void 0 : "Infinity" : void 0;
		return n.issues.push({
			expected: "number",
			code: "invalid_type",
			input: i,
			inst: e,
			...a ? { received: a } : {}
		}), n;
	};
}), hn = /* @__PURE__ */ h("$ZodNumberFormat", (e, t) => {
	Et.init(e, t), mn.init(e, t);
}), gn = /* @__PURE__ */ h("$ZodBoolean", (e, t) => {
	A.init(e, t), e._zod.pattern = yt, e._zod.parse = (n, r) => {
		if (t.coerce) try {
			n.value = !!n.value;
		} catch {}
		let i = n.value;
		return typeof i == "boolean" || n.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
	};
}), _n = /* @__PURE__ */ h("$ZodUnknown", (e, t) => {
	A.init(e, t), e._zod.parse = (e) => e;
}), vn = /* @__PURE__ */ h("$ZodNever", (e, t) => {
	A.init(e, t), e._zod.parse = (t, n) => (t.issues.push({
		expected: "never",
		code: "invalid_type",
		input: t.value,
		inst: e
	}), t);
});
function yn(e, t, n) {
	e.issues.length && t.issues.push(...E(n, e.issues)), t.value[n] = e.value;
}
var bn = /* @__PURE__ */ h("$ZodArray", (e, t) => {
	A.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!Array.isArray(i)) return n.issues.push({
			expected: "array",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		n.value = Array(i.length);
		let a = [];
		for (let e = 0; e < i.length; e++) {
			let o = i[e], s = t.element._zod.run({
				value: o,
				issues: []
			}, r);
			s instanceof Promise ? a.push(s.then((t) => yn(t, n, e))) : yn(s, n, e);
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
});
function xn(e, t, n, r, i) {
	if (e.issues.length) {
		if (i && !(n in r)) return;
		t.issues.push(...E(n, e.issues));
	}
	e.value === void 0 ? n in r && (t.value[n] = void 0) : t.value[n] = e.value;
}
function Sn(e) {
	let t = Object.keys(e.shape);
	for (let n of t) if (!e.shape?.[n]?._zod?.traits?.has("$ZodType")) throw Error(`Invalid element at key "${n}": expected a Zod schema`);
	let n = ge(e.shape);
	return {
		...e,
		keys: t,
		keySet: new Set(t),
		numKeys: t.length,
		optionalKeys: new Set(n)
	};
}
function Cn(e, t, n, r, i, a) {
	let o = [], s = i.keySet, c = i.catchall._zod, l = c.def.type, u = c.optout === "optional";
	for (let i in t) {
		if (s.has(i)) continue;
		if (l === "never") {
			o.push(i);
			continue;
		}
		let a = c.run({
			value: t[i],
			issues: []
		}, r);
		a instanceof Promise ? e.push(a.then((e) => xn(e, n, i, t, u))) : xn(a, n, i, t, u);
	}
	return o.length && n.issues.push({
		code: "unrecognized_keys",
		keys: o,
		input: t,
		inst: a
	}), e.length ? Promise.all(e).then(() => n) : n;
}
var wn = /* @__PURE__ */ h("$ZodObject", (e, t) => {
	if (A.init(e, t), !Object.getOwnPropertyDescriptor(t, "shape")?.get) {
		let e = t.shape;
		Object.defineProperty(t, "shape", { get: () => {
			let n = { ...e };
			return Object.defineProperty(t, "shape", { value: n }), n;
		} });
	}
	let n = ie(() => Sn(t));
	v(e._zod, "propValues", () => {
		let e = t.shape, n = {};
		for (let t in e) {
			let r = e[t]._zod;
			if (r.values) {
				n[t] ?? (n[t] = /* @__PURE__ */ new Set());
				for (let e of r.values) n[t].add(e);
			}
		}
		return n;
	});
	let r = fe, i = t.catchall, a;
	e._zod.parse = (t, o) => {
		a ??= n.value;
		let s = t.value;
		if (!r(s)) return t.issues.push({
			expected: "object",
			code: "invalid_type",
			input: s,
			inst: e
		}), t;
		t.value = {};
		let c = [], l = a.shape;
		for (let e of a.keys) {
			let n = l[e], r = n._zod.optout === "optional", i = n._zod.run({
				value: s[e],
				issues: []
			}, o);
			i instanceof Promise ? c.push(i.then((n) => xn(n, t, e, s, r))) : xn(i, t, e, s, r);
		}
		return i ? Cn(c, s, t, o, n.value, e) : c.length ? Promise.all(c).then(() => t) : t;
	};
}), Tn = /* @__PURE__ */ h("$ZodObjectJIT", (e, t) => {
	wn.init(e, t);
	let n = e._zod.parse, r = ie(() => Sn(t)), i = (e) => {
		let t = new Rt([
			"shape",
			"payload",
			"ctx"
		]), n = r.value, i = (e) => {
			let t = le(e);
			return `shape[${t}]._zod.run({ value: input[${t}], issues: [] }, ctx)`;
		};
		t.write("const input = payload.value;");
		let a = Object.create(null), o = 0;
		for (let e of n.keys) a[e] = `key_${o++}`;
		t.write("const newResult = {};");
		for (let r of n.keys) {
			let n = a[r], o = le(r), s = e[r]?._zod?.optout === "optional";
			t.write(`const ${n} = ${i(r)};`), s ? t.write(`
        if (${n}.issues.length) {
          if (${o} in input) {
            payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${o}, ...iss.path] : [${o}]
            })));
          }
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `) : t.write(`
        if (${n}.issues.length) {
          payload.issues = payload.issues.concat(${n}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${o}, ...iss.path] : [${o}]
          })));
        }
        
        if (${n}.value === undefined) {
          if (${o} in input) {
            newResult[${o}] = undefined;
          }
        } else {
          newResult[${o}] = ${n}.value;
        }
        
      `);
		}
		t.write("payload.value = newResult;"), t.write("return payload;");
		let s = t.compile();
		return (t, n) => s(e, t, n);
	}, a, o = fe, s = !te.jitless, c = s && pe.value, l = t.catchall, u;
	e._zod.parse = (d, f) => {
		u ??= r.value;
		let p = d.value;
		return o(p) ? s && c && f?.async === !1 && f.jitless !== !0 ? (a ||= i(t.shape), d = a(d, f), l ? Cn([], p, d, f, u, e) : d) : n(d, f) : (d.issues.push({
			expected: "object",
			code: "invalid_type",
			input: p,
			inst: e
		}), d);
	};
});
function En(e, t, n, r) {
	for (let n of e) if (n.issues.length === 0) return t.value = n.value, t;
	let i = e.filter((e) => !T(e));
	return i.length === 1 ? (t.value = i[0].value, i[0]) : (t.issues.push({
		code: "invalid_union",
		input: t.value,
		inst: n,
		errors: e.map((e) => e.issues.map((e) => D(e, r, _())))
	}), t);
}
var Dn = /* @__PURE__ */ h("$ZodUnion", (e, t) => {
	A.init(e, t), v(e._zod, "optin", () => t.options.some((e) => e._zod.optin === "optional") ? "optional" : void 0), v(e._zod, "optout", () => t.options.some((e) => e._zod.optout === "optional") ? "optional" : void 0), v(e._zod, "values", () => {
		if (t.options.every((e) => e._zod.values)) return new Set(t.options.flatMap((e) => Array.from(e._zod.values)));
	}), v(e._zod, "pattern", () => {
		if (t.options.every((e) => e._zod.pattern)) {
			let e = t.options.map((e) => e._zod.pattern);
			return RegExp(`^(${e.map((e) => oe(e.source)).join("|")})$`);
		}
	});
	let n = t.options.length === 1, r = t.options[0]._zod.run;
	e._zod.parse = (i, a) => {
		if (n) return r(i, a);
		let o = !1, s = [];
		for (let e of t.options) {
			let t = e._zod.run({
				value: i.value,
				issues: []
			}, a);
			if (t instanceof Promise) s.push(t), o = !0;
			else {
				if (t.issues.length === 0) return t;
				s.push(t);
			}
		}
		return o ? Promise.all(s).then((t) => En(t, i, e, a)) : En(s, i, e, a);
	};
}), On = /* @__PURE__ */ h("$ZodIntersection", (e, t) => {
	A.init(e, t), e._zod.parse = (e, n) => {
		let r = e.value, i = t.left._zod.run({
			value: r,
			issues: []
		}, n), a = t.right._zod.run({
			value: r,
			issues: []
		}, n);
		return i instanceof Promise || a instanceof Promise ? Promise.all([i, a]).then(([t, n]) => An(e, t, n)) : An(e, i, a);
	};
});
function kn(e, t) {
	if (e === t || e instanceof Date && t instanceof Date && +e == +t) return {
		valid: !0,
		data: e
	};
	if (x(e) && x(t)) {
		let n = Object.keys(t), r = Object.keys(e).filter((e) => n.indexOf(e) !== -1), i = {
			...e,
			...t
		};
		for (let n of r) {
			let r = kn(e[n], t[n]);
			if (!r.valid) return {
				valid: !1,
				mergeErrorPath: [n, ...r.mergeErrorPath]
			};
			i[n] = r.data;
		}
		return {
			valid: !0,
			data: i
		};
	}
	if (Array.isArray(e) && Array.isArray(t)) {
		if (e.length !== t.length) return {
			valid: !1,
			mergeErrorPath: []
		};
		let n = [];
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = t[r], o = kn(i, a);
			if (!o.valid) return {
				valid: !1,
				mergeErrorPath: [r, ...o.mergeErrorPath]
			};
			n.push(o.data);
		}
		return {
			valid: !0,
			data: n
		};
	}
	return {
		valid: !1,
		mergeErrorPath: []
	};
}
function An(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i;
	for (let n of t.issues) if (n.code === "unrecognized_keys") {
		i ??= n;
		for (let e of n.keys) r.has(e) || r.set(e, {}), r.get(e).l = !0;
	} else e.issues.push(n);
	for (let t of n.issues) if (t.code === "unrecognized_keys") for (let e of t.keys) r.has(e) || r.set(e, {}), r.get(e).r = !0;
	else e.issues.push(t);
	let a = [...r].filter(([, e]) => e.l && e.r).map(([e]) => e);
	if (a.length && i && e.issues.push({
		...i,
		keys: a
	}), T(e)) return e;
	let o = kn(t.value, n.value);
	if (!o.valid) throw Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);
	return e.value = o.data, e;
}
var jn = /* @__PURE__ */ h("$ZodRecord", (e, t) => {
	A.init(e, t), e._zod.parse = (n, r) => {
		let i = n.value;
		if (!x(i)) return n.issues.push({
			expected: "record",
			code: "invalid_type",
			input: i,
			inst: e
		}), n;
		let a = [], o = t.keyType._zod.values;
		if (o) {
			n.value = {};
			let s = /* @__PURE__ */ new Set();
			for (let e of o) if (typeof e == "string" || typeof e == "number" || typeof e == "symbol") {
				s.add(typeof e == "number" ? e.toString() : e);
				let o = t.valueType._zod.run({
					value: i[e],
					issues: []
				}, r);
				o instanceof Promise ? a.push(o.then((t) => {
					t.issues.length && n.issues.push(...E(e, t.issues)), n.value[e] = t.value;
				})) : (o.issues.length && n.issues.push(...E(e, o.issues)), n.value[e] = o.value);
			}
			let c;
			for (let e in i) s.has(e) || (c ??= [], c.push(e));
			c && c.length > 0 && n.issues.push({
				code: "unrecognized_keys",
				input: i,
				inst: e,
				keys: c
			});
		} else {
			n.value = {};
			for (let o of Reflect.ownKeys(i)) {
				if (o === "__proto__") continue;
				let s = t.keyType._zod.run({
					value: o,
					issues: []
				}, r);
				if (s instanceof Promise) throw Error("Async schemas not supported in object keys currently");
				if (typeof o == "string" && vt.test(o) && s.issues.length) {
					let e = t.keyType._zod.run({
						value: Number(o),
						issues: []
					}, r);
					if (e instanceof Promise) throw Error("Async schemas not supported in object keys currently");
					e.issues.length === 0 && (s = e);
				}
				if (s.issues.length) {
					t.mode === "loose" ? n.value[o] = i[o] : n.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: s.issues.map((e) => D(e, r, _())),
						input: o,
						path: [o],
						inst: e
					});
					continue;
				}
				let c = t.valueType._zod.run({
					value: i[o],
					issues: []
				}, r);
				c instanceof Promise ? a.push(c.then((e) => {
					e.issues.length && n.issues.push(...E(o, e.issues)), n.value[s.value] = e.value;
				})) : (c.issues.length && n.issues.push(...E(o, c.issues)), n.value[s.value] = c.value);
			}
		}
		return a.length ? Promise.all(a).then(() => n) : n;
	};
}), Mn = /* @__PURE__ */ h("$ZodEnum", (e, t) => {
	A.init(e, t);
	let n = ne(t.entries), r = new Set(n);
	e._zod.values = r, e._zod.pattern = RegExp(`^(${n.filter((e) => he.has(typeof e)).map((e) => typeof e == "string" ? S(e) : e.toString()).join("|")})$`), e._zod.parse = (t, i) => {
		let a = t.value;
		return r.has(a) || t.issues.push({
			code: "invalid_value",
			values: n,
			input: a,
			inst: e
		}), t;
	};
}), Nn = /* @__PURE__ */ h("$ZodLiteral", (e, t) => {
	if (A.init(e, t), t.values.length === 0) throw Error("Cannot create literal schema with no valid values");
	let n = new Set(t.values);
	e._zod.values = n, e._zod.pattern = RegExp(`^(${t.values.map((e) => typeof e == "string" ? S(e) : e ? S(e.toString()) : String(e)).join("|")})$`), e._zod.parse = (r, i) => {
		let a = r.value;
		return n.has(a) || r.issues.push({
			code: "invalid_value",
			values: t.values,
			input: a,
			inst: e
		}), r;
	};
}), Pn = /* @__PURE__ */ h("$ZodTransform", (e, t) => {
	A.init(e, t), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new ee(e.constructor.name);
		let i = t.transform(n.value, n);
		if (r.async) return (i instanceof Promise ? i : Promise.resolve(i)).then((e) => (n.value = e, n));
		if (i instanceof Promise) throw new g();
		return n.value = i, n;
	};
});
function Fn(e, t) {
	return e.issues.length && t === void 0 ? {
		issues: [],
		value: void 0
	} : e;
}
var In = /* @__PURE__ */ h("$ZodOptional", (e, t) => {
	A.init(e, t), e._zod.optin = "optional", e._zod.optout = "optional", v(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, void 0]) : void 0), v(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${oe(e.source)})?$`) : void 0;
	}), e._zod.parse = (e, n) => {
		if (t.innerType._zod.optin === "optional") {
			let r = t.innerType._zod.run(e, n);
			return r instanceof Promise ? r.then((t) => Fn(t, e.value)) : Fn(r, e.value);
		}
		return e.value === void 0 ? e : t.innerType._zod.run(e, n);
	};
}), Ln = /* @__PURE__ */ h("$ZodExactOptional", (e, t) => {
	In.init(e, t), v(e._zod, "values", () => t.innerType._zod.values), v(e._zod, "pattern", () => t.innerType._zod.pattern), e._zod.parse = (e, n) => t.innerType._zod.run(e, n);
}), Rn = /* @__PURE__ */ h("$ZodNullable", (e, t) => {
	A.init(e, t), v(e._zod, "optin", () => t.innerType._zod.optin), v(e._zod, "optout", () => t.innerType._zod.optout), v(e._zod, "pattern", () => {
		let e = t.innerType._zod.pattern;
		return e ? RegExp(`^(${oe(e.source)}|null)$`) : void 0;
	}), v(e._zod, "values", () => t.innerType._zod.values ? new Set([...t.innerType._zod.values, null]) : void 0), e._zod.parse = (e, n) => e.value === null ? e : t.innerType._zod.run(e, n);
}), zn = /* @__PURE__ */ h("$ZodDefault", (e, t) => {
	A.init(e, t), e._zod.optin = "optional", v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		if (e.value === void 0) return e.value = t.defaultValue, e;
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Bn(e, t)) : Bn(r, t);
	};
});
function Bn(e, t) {
	return e.value === void 0 && (e.value = t.defaultValue), e;
}
var Vn = /* @__PURE__ */ h("$ZodPrefault", (e, t) => {
	A.init(e, t), e._zod.optin = "optional", v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => (n.direction === "backward" || e.value === void 0 && (e.value = t.defaultValue), t.innerType._zod.run(e, n));
}), Hn = /* @__PURE__ */ h("$ZodNonOptional", (e, t) => {
	A.init(e, t), v(e._zod, "values", () => {
		let e = t.innerType._zod.values;
		return e ? new Set([...e].filter((e) => e !== void 0)) : void 0;
	}), e._zod.parse = (n, r) => {
		let i = t.innerType._zod.run(n, r);
		return i instanceof Promise ? i.then((t) => Un(t, e)) : Un(i, e);
	};
});
function Un(e, t) {
	return !e.issues.length && e.value === void 0 && e.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: e.value,
		inst: t
	}), e;
}
var Wn = /* @__PURE__ */ h("$ZodCatch", (e, t) => {
	A.init(e, t), v(e._zod, "optin", () => t.innerType._zod.optin), v(e._zod, "optout", () => t.innerType._zod.optout), v(e._zod, "values", () => t.innerType._zod.values), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then((r) => (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => D(e, n, _())) },
			input: e.value
		}), e.issues = []), e)) : (e.value = r.value, r.issues.length && (e.value = t.catchValue({
			...e,
			error: { issues: r.issues.map((e) => D(e, n, _())) },
			input: e.value
		}), e.issues = []), e);
	};
}), Gn = /* @__PURE__ */ h("$ZodPipe", (e, t) => {
	A.init(e, t), v(e._zod, "values", () => t.in._zod.values), v(e._zod, "optin", () => t.in._zod.optin), v(e._zod, "optout", () => t.out._zod.optout), v(e._zod, "propValues", () => t.in._zod.propValues), e._zod.parse = (e, n) => {
		if (n.direction === "backward") {
			let r = t.out._zod.run(e, n);
			return r instanceof Promise ? r.then((e) => Kn(e, t.in, n)) : Kn(r, t.in, n);
		}
		let r = t.in._zod.run(e, n);
		return r instanceof Promise ? r.then((e) => Kn(e, t.out, n)) : Kn(r, t.out, n);
	};
});
function Kn(e, t, n) {
	return e.issues.length ? (e.aborted = !0, e) : t._zod.run({
		value: e.value,
		issues: e.issues
	}, n);
}
var qn = /* @__PURE__ */ h("$ZodReadonly", (e, t) => {
	A.init(e, t), v(e._zod, "propValues", () => t.innerType._zod.propValues), v(e._zod, "values", () => t.innerType._zod.values), v(e._zod, "optin", () => t.innerType?._zod?.optin), v(e._zod, "optout", () => t.innerType?._zod?.optout), e._zod.parse = (e, n) => {
		if (n.direction === "backward") return t.innerType._zod.run(e, n);
		let r = t.innerType._zod.run(e, n);
		return r instanceof Promise ? r.then(Jn) : Jn(r);
	};
});
function Jn(e) {
	return e.value = Object.freeze(e.value), e;
}
var Yn = /* @__PURE__ */ h("$ZodCustom", (e, t) => {
	k.init(e, t), A.init(e, t), e._zod.parse = (e, t) => e, e._zod.check = (n) => {
		let r = n.value, i = t.fn(r);
		if (i instanceof Promise) return i.then((t) => Xn(t, n, r, e));
		Xn(i, n, r, e);
	};
});
function Xn(e, t, n, r) {
	if (!e) {
		let e = {
			code: "custom",
			input: n,
			inst: r,
			path: [...r._zod.def.path ?? []],
			continue: !r._zod.def.abort
		};
		r._zod.def.params && (e.params = r._zod.def.params), t.issues.push(O(e));
	}
}
//#endregion
//#region node_modules/zod/v4/core/registries.js
var Zn, Qn = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map();
	}
	add(e, ...t) {
		let n = t[0];
		return this._map.set(e, n), n && typeof n == "object" && "id" in n && this._idmap.set(n.id, e), this;
	}
	clear() {
		return this._map = /* @__PURE__ */ new WeakMap(), this._idmap = /* @__PURE__ */ new Map(), this;
	}
	remove(e) {
		let t = this._map.get(e);
		return t && typeof t == "object" && "id" in t && this._idmap.delete(t.id), this._map.delete(e), this;
	}
	get(e) {
		let t = e._zod.parent;
		if (t) {
			let n = { ...this.get(t) ?? {} };
			delete n.id;
			let r = {
				...n,
				...this._map.get(e)
			};
			return Object.keys(r).length ? r : void 0;
		}
		return this._map.get(e);
	}
	has(e) {
		return this._map.has(e);
	}
};
function $n() {
	return new Qn();
}
(Zn = globalThis).__zod_globalRegistry ?? (Zn.__zod_globalRegistry = $n());
var M = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/zod/v4/core/api.js
/* @__NO_SIDE_EFFECTS__ */
function er(e, t) {
	return new e({
		type: "string",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function tr(e, t) {
	return new e({
		type: "string",
		format: "email",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function nr(e, t) {
	return new e({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function rr(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ir(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v4",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ar(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v6",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function or(e, t) {
	return new e({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: !1,
		version: "v7",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function sr(e, t) {
	return new e({
		type: "string",
		format: "url",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function cr(e, t) {
	return new e({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function lr(e, t) {
	return new e({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function ur(e, t) {
	return new e({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function dr(e, t) {
	return new e({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function fr(e, t) {
	return new e({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function pr(e, t) {
	return new e({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function mr(e, t) {
	return new e({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function hr(e, t) {
	return new e({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function gr(e, t) {
	return new e({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function _r(e, t) {
	return new e({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function vr(e, t) {
	return new e({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function yr(e, t) {
	return new e({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function br(e, t) {
	return new e({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function xr(e, t) {
	return new e({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Sr(e, t) {
	return new e({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: !1,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Cr(e, t) {
	return new e({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: !1,
		local: !1,
		precision: null,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function wr(e, t) {
	return new e({
		type: "string",
		format: "date",
		check: "string_format",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Tr(e, t) {
	return new e({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Er(e, t) {
	return new e({
		type: "string",
		format: "duration",
		check: "string_format",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Dr(e, t) {
	return new e({
		type: "number",
		checks: [],
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Or(e, t) {
	return new e({
		type: "number",
		check: "number_format",
		abort: !1,
		format: "safeint",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function kr(e, t) {
	return new e({
		type: "boolean",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Ar(e) {
	return new e({ type: "unknown" });
}
/* @__NO_SIDE_EFFECTS__ */
function jr(e, t) {
	return new e({
		type: "never",
		...w(t)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Mr(e, t) {
	return new Ct({
		check: "less_than",
		...w(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Nr(e, t) {
	return new Ct({
		check: "less_than",
		...w(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Pr(e, t) {
	return new wt({
		check: "greater_than",
		...w(t),
		value: e,
		inclusive: !1
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Fr(e, t) {
	return new wt({
		check: "greater_than",
		...w(t),
		value: e,
		inclusive: !0
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Ir(e, t) {
	return new Tt({
		check: "multiple_of",
		...w(t),
		value: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Lr(e, t) {
	return new Dt({
		check: "max_length",
		...w(t),
		maximum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Rr(e, t) {
	return new Ot({
		check: "min_length",
		...w(t),
		minimum: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function zr(e, t) {
	return new kt({
		check: "length_equals",
		...w(t),
		length: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Br(e, t) {
	return new jt({
		check: "string_format",
		format: "regex",
		...w(t),
		pattern: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Vr(e) {
	return new Mt({
		check: "string_format",
		format: "lowercase",
		...w(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Hr(e) {
	return new Nt({
		check: "string_format",
		format: "uppercase",
		...w(e)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Ur(e, t) {
	return new Pt({
		check: "string_format",
		format: "includes",
		...w(t),
		includes: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Wr(e, t) {
	return new Ft({
		check: "string_format",
		format: "starts_with",
		...w(t),
		prefix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Gr(e, t) {
	return new It({
		check: "string_format",
		format: "ends_with",
		...w(t),
		suffix: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function N(e) {
	return new Lt({
		check: "overwrite",
		tx: e
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Kr(e) {
	return /* @__PURE__ */ N((t) => t.normalize(e));
}
/* @__NO_SIDE_EFFECTS__ */
function qr() {
	return /* @__PURE__ */ N((e) => e.trim());
}
/* @__NO_SIDE_EFFECTS__ */
function Jr() {
	return /* @__PURE__ */ N((e) => e.toLowerCase());
}
/* @__NO_SIDE_EFFECTS__ */
function Yr() {
	return /* @__PURE__ */ N((e) => e.toUpperCase());
}
/* @__NO_SIDE_EFFECTS__ */
function Xr() {
	return /* @__PURE__ */ N((e) => ue(e));
}
/* @__NO_SIDE_EFFECTS__ */
function Zr(e, t, n) {
	return new e({
		type: "array",
		element: t,
		...w(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function Qr(e, t, n) {
	return new e({
		type: "custom",
		check: "custom",
		fn: t,
		...w(n)
	});
}
/* @__NO_SIDE_EFFECTS__ */
function $r(e) {
	let t = /* @__PURE__ */ ei((n) => (n.addIssue = (e) => {
		if (typeof e == "string") n.issues.push(O(e, n.value, t._zod.def));
		else {
			let r = e;
			r.fatal && (r.continue = !1), r.code ??= "custom", r.input ??= n.value, r.inst ??= t, r.continue ??= !t._zod.def.abort, n.issues.push(O(r));
		}
	}, e(n.value, n)));
	return t;
}
/* @__NO_SIDE_EFFECTS__ */
function ei(e, t) {
	let n = new k({
		check: "custom",
		...w(t)
	});
	return n._zod.check = e, n;
}
//#endregion
//#region node_modules/zod/v4/core/to-json-schema.js
function ti(e) {
	let t = e?.target ?? "draft-2020-12";
	return t === "draft-4" && (t = "draft-04"), t === "draft-7" && (t = "draft-07"), {
		processors: e.processors ?? {},
		metadataRegistry: e?.metadata ?? M,
		target: t,
		unrepresentable: e?.unrepresentable ?? "throw",
		override: e?.override ?? (() => {}),
		io: e?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: e?.cycles ?? "ref",
		reused: e?.reused ?? "inline",
		external: e?.external ?? void 0
	};
}
function P(e, t, n = {
	path: [],
	schemaPath: []
}) {
	var r;
	let i = e._zod.def, a = t.seen.get(e);
	if (a) return a.count++, n.schemaPath.includes(e) && (a.cycle = n.path), a.schema;
	let o = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: n.path
	};
	t.seen.set(e, o);
	let s = e._zod.toJSONSchema?.();
	if (s) o.schema = s;
	else {
		let r = {
			...n,
			schemaPath: [...n.schemaPath, e],
			path: n.path
		};
		if (e._zod.processJSONSchema) e._zod.processJSONSchema(t, o.schema, r);
		else {
			let n = o.schema, a = t.processors[i.type];
			if (!a) throw Error(`[toJSONSchema]: Non-representable type encountered: ${i.type}`);
			a(e, t, n, r);
		}
		let a = e._zod.parent;
		a && (o.ref ||= a, P(a, t, r), t.seen.get(a).isParent = !0);
	}
	let c = t.metadataRegistry.get(e);
	return c && Object.assign(o.schema, c), t.io === "input" && F(e) && (delete o.schema.examples, delete o.schema.default), t.io === "input" && o.schema._prefault && ((r = o.schema).default ?? (r.default = o.schema._prefault)), delete o.schema._prefault, t.seen.get(e).schema;
}
function ni(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = /* @__PURE__ */ new Map();
	for (let t of e.seen.entries()) {
		let n = e.metadataRegistry.get(t[0])?.id;
		if (n) {
			let e = r.get(n);
			if (e && e !== t[0]) throw Error(`Duplicate schema id "${n}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			r.set(n, t[0]);
		}
	}
	let i = (t) => {
		let r = e.target === "draft-2020-12" ? "$defs" : "definitions";
		if (e.external) {
			let n = e.external.registry.get(t[0])?.id, i = e.external.uri ?? ((e) => e);
			if (n) return { ref: i(n) };
			let a = t[1].defId ?? t[1].schema.id ?? `schema${e.counter++}`;
			return t[1].defId = a, {
				defId: a,
				ref: `${i("__shared")}#/${r}/${a}`
			};
		}
		if (t[1] === n) return { ref: "#" };
		let i = `#/${r}/`, a = t[1].schema.id ?? `__schema${e.counter++}`;
		return {
			defId: a,
			ref: i + a
		};
	}, a = (e) => {
		if (e[1].schema.$ref) return;
		let t = e[1], { ref: n, defId: r } = i(e);
		t.def = { ...t.schema }, r && (t.defId = r);
		let a = t.schema;
		for (let e in a) delete a[e];
		a.$ref = n;
	};
	if (e.cycles === "throw") for (let t of e.seen.entries()) {
		let e = t[1];
		if (e.cycle) throw Error(`Cycle detected: #/${e.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (let n of e.seen.entries()) {
		let r = n[1];
		if (t === n[0]) {
			a(n);
			continue;
		}
		if (e.external) {
			let r = e.external.registry.get(n[0])?.id;
			if (t !== n[0] && r) {
				a(n);
				continue;
			}
		}
		if (e.metadataRegistry.get(n[0])?.id) {
			a(n);
			continue;
		}
		if (r.cycle) {
			a(n);
			continue;
		}
		if (r.count > 1 && e.reused === "ref") {
			a(n);
			continue;
		}
	}
}
function ri(e, t) {
	let n = e.seen.get(t);
	if (!n) throw Error("Unprocessed schema. This is a bug in Zod.");
	let r = (t) => {
		let n = e.seen.get(t);
		if (n.ref === null) return;
		let i = n.def ?? n.schema, a = { ...i }, o = n.ref;
		if (n.ref = null, o) {
			r(o);
			let n = e.seen.get(o), s = n.schema;
			if (s.$ref && (e.target === "draft-07" || e.target === "draft-04" || e.target === "openapi-3.0") ? (i.allOf = i.allOf ?? [], i.allOf.push(s)) : Object.assign(i, s), Object.assign(i, a), t._zod.parent === o) for (let e in i) e === "$ref" || e === "allOf" || e in a || delete i[e];
			if (s.$ref && n.def) for (let e in i) e === "$ref" || e === "allOf" || e in n.def && JSON.stringify(i[e]) === JSON.stringify(n.def[e]) && delete i[e];
		}
		let s = t._zod.parent;
		if (s && s !== o) {
			r(s);
			let t = e.seen.get(s);
			if (t?.schema.$ref && (i.$ref = t.schema.$ref, t.def)) for (let e in i) e === "$ref" || e === "allOf" || e in t.def && JSON.stringify(i[e]) === JSON.stringify(t.def[e]) && delete i[e];
		}
		e.override({
			zodSchema: t,
			jsonSchema: i,
			path: n.path ?? []
		});
	};
	for (let t of [...e.seen.entries()].reverse()) r(t[0]);
	let i = {};
	if (e.target === "draft-2020-12" ? i.$schema = "https://json-schema.org/draft/2020-12/schema" : e.target === "draft-07" ? i.$schema = "http://json-schema.org/draft-07/schema#" : e.target === "draft-04" ? i.$schema = "http://json-schema.org/draft-04/schema#" : e.target, e.external?.uri) {
		let n = e.external.registry.get(t)?.id;
		if (!n) throw Error("Schema is missing an `id` property");
		i.$id = e.external.uri(n);
	}
	Object.assign(i, n.def ?? n.schema);
	let a = e.external?.defs ?? {};
	for (let t of e.seen.entries()) {
		let e = t[1];
		e.def && e.defId && (a[e.defId] = e.def);
	}
	e.external || Object.keys(a).length > 0 && (e.target === "draft-2020-12" ? i.$defs = a : i.definitions = a);
	try {
		let n = JSON.parse(JSON.stringify(i));
		return Object.defineProperty(n, "~standard", {
			value: {
				...t["~standard"],
				jsonSchema: {
					input: ai(t, "input", e.processors),
					output: ai(t, "output", e.processors)
				}
			},
			enumerable: !1,
			writable: !1
		}), n;
	} catch {
		throw Error("Error converting schema to JSON.");
	}
}
function F(e, t) {
	let n = t ?? { seen: /* @__PURE__ */ new Set() };
	if (n.seen.has(e)) return !1;
	n.seen.add(e);
	let r = e._zod.def;
	if (r.type === "transform") return !0;
	if (r.type === "array") return F(r.element, n);
	if (r.type === "set") return F(r.valueType, n);
	if (r.type === "lazy") return F(r.getter(), n);
	if (r.type === "promise" || r.type === "optional" || r.type === "nonoptional" || r.type === "nullable" || r.type === "readonly" || r.type === "default" || r.type === "prefault") return F(r.innerType, n);
	if (r.type === "intersection") return F(r.left, n) || F(r.right, n);
	if (r.type === "record" || r.type === "map") return F(r.keyType, n) || F(r.valueType, n);
	if (r.type === "pipe") return F(r.in, n) || F(r.out, n);
	if (r.type === "object") {
		for (let e in r.shape) if (F(r.shape[e], n)) return !0;
		return !1;
	}
	if (r.type === "union") {
		for (let e of r.options) if (F(e, n)) return !0;
		return !1;
	}
	if (r.type === "tuple") {
		for (let e of r.items) if (F(e, n)) return !0;
		return !!(r.rest && F(r.rest, n));
	}
	return !1;
}
var ii = (e, t = {}) => (n) => {
	let r = ti({
		...n,
		processors: t
	});
	return P(e, r), ni(r, e), ri(r, e);
}, ai = (e, t, n = {}) => (r) => {
	let { libraryOptions: i, target: a } = r ?? {}, o = ti({
		...i ?? {},
		target: a,
		io: t,
		processors: n
	});
	return P(e, o), ni(o, e), ri(o, e);
}, oi = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
}, si = (e, t, n, r) => {
	let i = n;
	i.type = "string";
	let { minimum: a, maximum: o, format: s, patterns: c, contentEncoding: l } = e._zod.bag;
	if (typeof a == "number" && (i.minLength = a), typeof o == "number" && (i.maxLength = o), s && (i.format = oi[s] ?? s, i.format === "" && delete i.format, s === "time" && delete i.format), l && (i.contentEncoding = l), c && c.size > 0) {
		let e = [...c];
		e.length === 1 ? i.pattern = e[0].source : e.length > 1 && (i.allOf = [...e.map((e) => ({
			...t.target === "draft-07" || t.target === "draft-04" || t.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: e.source
		}))]);
	}
}, ci = (e, t, n, r) => {
	let i = n, { minimum: a, maximum: o, format: s, multipleOf: c, exclusiveMaximum: l, exclusiveMinimum: u } = e._zod.bag;
	typeof s == "string" && s.includes("int") ? i.type = "integer" : i.type = "number", typeof u == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.minimum = u, i.exclusiveMinimum = !0) : i.exclusiveMinimum = u), typeof a == "number" && (i.minimum = a, typeof u == "number" && t.target !== "draft-04" && (u >= a ? delete i.minimum : delete i.exclusiveMinimum)), typeof l == "number" && (t.target === "draft-04" || t.target === "openapi-3.0" ? (i.maximum = l, i.exclusiveMaximum = !0) : i.exclusiveMaximum = l), typeof o == "number" && (i.maximum = o, typeof l == "number" && t.target !== "draft-04" && (l <= o ? delete i.maximum : delete i.exclusiveMaximum)), typeof c == "number" && (i.multipleOf = c);
}, li = (e, t, n, r) => {
	n.type = "boolean";
}, ui = (e, t, n, r) => {
	n.not = {};
}, di = (e, t, n, r) => {
	let i = e._zod.def, a = ne(i.entries);
	a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), n.enum = a;
}, fi = (e, t, n, r) => {
	let i = e._zod.def, a = [];
	for (let e of i.values) if (e === void 0) {
		if (t.unrepresentable === "throw") throw Error("Literal `undefined` cannot be represented in JSON Schema");
	} else if (typeof e == "bigint") {
		if (t.unrepresentable === "throw") throw Error("BigInt literals cannot be represented in JSON Schema");
		a.push(Number(e));
	} else a.push(e);
	if (a.length !== 0) if (a.length === 1) {
		let e = a[0];
		n.type = e === null ? "null" : typeof e, t.target === "draft-04" || t.target === "openapi-3.0" ? n.enum = [e] : n.const = e;
	} else a.every((e) => typeof e == "number") && (n.type = "number"), a.every((e) => typeof e == "string") && (n.type = "string"), a.every((e) => typeof e == "boolean") && (n.type = "boolean"), a.every((e) => e === null) && (n.type = "null"), n.enum = a;
}, pi = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Custom types cannot be represented in JSON Schema");
}, mi = (e, t, n, r) => {
	if (t.unrepresentable === "throw") throw Error("Transforms cannot be represented in JSON Schema");
}, hi = (e, t, n, r) => {
	let i = n, a = e._zod.def, { minimum: o, maximum: s } = e._zod.bag;
	typeof o == "number" && (i.minItems = o), typeof s == "number" && (i.maxItems = s), i.type = "array", i.items = P(a.element, t, {
		...r,
		path: [...r.path, "items"]
	});
}, gi = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object", i.properties = {};
	let o = a.shape;
	for (let e in o) i.properties[e] = P(o[e], t, {
		...r,
		path: [
			...r.path,
			"properties",
			e
		]
	});
	let s = new Set(Object.keys(o)), c = new Set([...s].filter((e) => {
		let n = a.shape[e]._zod;
		return t.io === "input" ? n.optin === void 0 : n.optout === void 0;
	}));
	c.size > 0 && (i.required = Array.from(c)), a.catchall?._zod.def.type === "never" ? i.additionalProperties = !1 : a.catchall ? a.catchall && (i.additionalProperties = P(a.catchall, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	})) : t.io === "output" && (i.additionalProperties = !1);
}, _i = (e, t, n, r) => {
	let i = e._zod.def, a = i.inclusive === !1, o = i.options.map((e, n) => P(e, t, {
		...r,
		path: [
			...r.path,
			a ? "oneOf" : "anyOf",
			n
		]
	}));
	a ? n.oneOf = o : n.anyOf = o;
}, vi = (e, t, n, r) => {
	let i = e._zod.def, a = P(i.left, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			0
		]
	}), o = P(i.right, t, {
		...r,
		path: [
			...r.path,
			"allOf",
			1
		]
	}), s = (e) => "allOf" in e && Object.keys(e).length === 1;
	n.allOf = [...s(a) ? a.allOf : [a], ...s(o) ? o.allOf : [o]];
}, yi = (e, t, n, r) => {
	let i = n, a = e._zod.def;
	i.type = "object";
	let o = a.keyType, s = o._zod.bag?.patterns;
	if (a.mode === "loose" && s && s.size > 0) {
		let e = P(a.valueType, t, {
			...r,
			path: [
				...r.path,
				"patternProperties",
				"*"
			]
		});
		i.patternProperties = {};
		for (let t of s) i.patternProperties[t.source] = e;
	} else (t.target === "draft-07" || t.target === "draft-2020-12") && (i.propertyNames = P(a.keyType, t, {
		...r,
		path: [...r.path, "propertyNames"]
	})), i.additionalProperties = P(a.valueType, t, {
		...r,
		path: [...r.path, "additionalProperties"]
	});
	let c = o._zod.values;
	if (c) {
		let e = [...c].filter((e) => typeof e == "string" || typeof e == "number");
		e.length > 0 && (i.required = e);
	}
}, bi = (e, t, n, r) => {
	let i = e._zod.def, a = P(i.innerType, t, r), o = t.seen.get(e);
	t.target === "openapi-3.0" ? (o.ref = i.innerType, n.nullable = !0) : n.anyOf = [a, { type: "null" }];
}, xi = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Si = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.default = JSON.parse(JSON.stringify(i.defaultValue));
}, Ci = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, t.io === "input" && (n._prefault = JSON.parse(JSON.stringify(i.defaultValue)));
}, wi = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
	let o;
	try {
		o = i.catchValue(void 0);
	} catch {
		throw Error("Dynamic catch values are not supported in JSON Schema");
	}
	n.default = o;
}, Ti = (e, t, n, r) => {
	let i = e._zod.def, a = t.io === "input" ? i.in._zod.def.type === "transform" ? i.out : i.in : i.out;
	P(a, t, r);
	let o = t.seen.get(e);
	o.ref = a;
}, Ei = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType, n.readOnly = !0;
}, Di = (e, t, n, r) => {
	let i = e._zod.def;
	P(i.innerType, t, r);
	let a = t.seen.get(e);
	a.ref = i.innerType;
}, Oi = /* @__PURE__ */ h("ZodISODateTime", (e, t) => {
	Qt.init(e, t), z.init(e, t);
});
function ki(e) {
	return /* @__PURE__ */ Cr(Oi, e);
}
var Ai = /* @__PURE__ */ h("ZodISODate", (e, t) => {
	$t.init(e, t), z.init(e, t);
});
function ji(e) {
	return /* @__PURE__ */ wr(Ai, e);
}
var Mi = /* @__PURE__ */ h("ZodISOTime", (e, t) => {
	en.init(e, t), z.init(e, t);
});
function Ni(e) {
	return /* @__PURE__ */ Tr(Mi, e);
}
var Pi = /* @__PURE__ */ h("ZodISODuration", (e, t) => {
	tn.init(e, t), z.init(e, t);
});
function Fi(e) {
	return /* @__PURE__ */ Er(Pi, e);
}
//#endregion
//#region node_modules/zod/v4/classic/errors.js
var Ii = (e, t) => {
	Oe.init(e, t), e.name = "ZodError", Object.defineProperties(e, {
		format: { value: (t) => je(e, t) },
		flatten: { value: (t) => Ae(e, t) },
		addIssue: { value: (t) => {
			e.issues.push(t), e.message = JSON.stringify(e.issues, re, 2);
		} },
		addIssues: { value: (t) => {
			e.issues.push(...t), e.message = JSON.stringify(e.issues, re, 2);
		} },
		isEmpty: { get() {
			return e.issues.length === 0;
		} }
	});
};
h("ZodError", Ii);
var I = h("ZodError", Ii, { Parent: Error }), Li = /* @__PURE__ */ Me(I), Ri = /* @__PURE__ */ Ne(I), zi = /* @__PURE__ */ Pe(I), Bi = /* @__PURE__ */ Ie(I), Vi = /* @__PURE__ */ Re(I), Hi = /* @__PURE__ */ ze(I), Ui = /* @__PURE__ */ Be(I), Wi = /* @__PURE__ */ Ve(I), Gi = /* @__PURE__ */ He(I), Ki = /* @__PURE__ */ Ue(I), qi = /* @__PURE__ */ We(I), Ji = /* @__PURE__ */ Ge(I), L = /* @__PURE__ */ h("ZodType", (e, t) => (A.init(e, t), Object.assign(e["~standard"], { jsonSchema: {
	input: ai(e, "input"),
	output: ai(e, "output")
} }), e.toJSONSchema = ii(e, {}), e.def = t, e.type = t.type, Object.defineProperty(e, "_def", { value: t }), e.check = (...n) => e.clone(b(t, { checks: [...t.checks ?? [], ...n.map((e) => typeof e == "function" ? { _zod: {
	check: e,
	def: { check: "custom" },
	onattach: []
} } : e)] }), { parent: !0 }), e.with = e.check, e.clone = (t, n) => C(e, t, n), e.brand = () => e, e.register = ((t, n) => (t.add(e, n), e)), e.parse = (t, n) => Li(e, t, n, { callee: e.parse }), e.safeParse = (t, n) => zi(e, t, n), e.parseAsync = async (t, n) => Ri(e, t, n, { callee: e.parseAsync }), e.safeParseAsync = async (t, n) => Bi(e, t, n), e.spa = e.safeParseAsync, e.encode = (t, n) => Vi(e, t, n), e.decode = (t, n) => Hi(e, t, n), e.encodeAsync = async (t, n) => Ui(e, t, n), e.decodeAsync = async (t, n) => Wi(e, t, n), e.safeEncode = (t, n) => Gi(e, t, n), e.safeDecode = (t, n) => Ki(e, t, n), e.safeEncodeAsync = async (t, n) => qi(e, t, n), e.safeDecodeAsync = async (t, n) => Ji(e, t, n), e.refine = (t, n) => e.check(io(t, n)), e.superRefine = (t) => e.check(ao(t)), e.overwrite = (t) => e.check(/* @__PURE__ */ N(t)), e.optional = () => Ba(e), e.exactOptional = () => Ha(e), e.nullable = () => Wa(e), e.nullish = () => Ba(Wa(e)), e.nonoptional = (t) => Xa(e, t), e.array = () => B(e), e.or = (t) => ka([e, t]), e.and = (t) => ja(e, t), e.transform = (t) => eo(e, Ra(t)), e.default = (t) => Ka(e, t), e.prefault = (t) => Ja(e, t), e.catch = (t) => Qa(e, t), e.pipe = (t) => eo(e, t), e.readonly = () => no(e), e.describe = (t) => {
	let n = e.clone();
	return M.add(n, { description: t }), n;
}, Object.defineProperty(e, "description", {
	get() {
		return M.get(e)?.description;
	},
	configurable: !0
}), e.meta = (...t) => {
	if (t.length === 0) return M.get(e);
	let n = e.clone();
	return M.add(n, t[0]), n;
}, e.isOptional = () => e.safeParse(void 0).success, e.isNullable = () => e.safeParse(null).success, e.apply = (t) => t(e), e)), Yi = /* @__PURE__ */ h("_ZodString", (e, t) => {
	Bt.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => si(e, t, n, r);
	let n = e._zod.bag;
	e.format = n.format ?? null, e.minLength = n.minimum ?? null, e.maxLength = n.maximum ?? null, e.regex = (...t) => e.check(/* @__PURE__ */ Br(...t)), e.includes = (...t) => e.check(/* @__PURE__ */ Ur(...t)), e.startsWith = (...t) => e.check(/* @__PURE__ */ Wr(...t)), e.endsWith = (...t) => e.check(/* @__PURE__ */ Gr(...t)), e.min = (...t) => e.check(/* @__PURE__ */ Rr(...t)), e.max = (...t) => e.check(/* @__PURE__ */ Lr(...t)), e.length = (...t) => e.check(/* @__PURE__ */ zr(...t)), e.nonempty = (...t) => e.check(/* @__PURE__ */ Rr(1, ...t)), e.lowercase = (t) => e.check(/* @__PURE__ */ Vr(t)), e.uppercase = (t) => e.check(/* @__PURE__ */ Hr(t)), e.trim = () => e.check(/* @__PURE__ */ qr()), e.normalize = (...t) => e.check(/* @__PURE__ */ Kr(...t)), e.toLowerCase = () => e.check(/* @__PURE__ */ Jr()), e.toUpperCase = () => e.check(/* @__PURE__ */ Yr()), e.slugify = () => e.check(/* @__PURE__ */ Xr());
}), Xi = /* @__PURE__ */ h("ZodString", (e, t) => {
	Bt.init(e, t), Yi.init(e, t), e.email = (t) => e.check(/* @__PURE__ */ tr(Zi, t)), e.url = (t) => e.check(/* @__PURE__ */ sr(ea, t)), e.jwt = (t) => e.check(/* @__PURE__ */ Sr(ha, t)), e.emoji = (t) => e.check(/* @__PURE__ */ cr(ta, t)), e.guid = (t) => e.check(/* @__PURE__ */ nr(Qi, t)), e.uuid = (t) => e.check(/* @__PURE__ */ rr($i, t)), e.uuidv4 = (t) => e.check(/* @__PURE__ */ ir($i, t)), e.uuidv6 = (t) => e.check(/* @__PURE__ */ ar($i, t)), e.uuidv7 = (t) => e.check(/* @__PURE__ */ or($i, t)), e.nanoid = (t) => e.check(/* @__PURE__ */ lr(na, t)), e.guid = (t) => e.check(/* @__PURE__ */ nr(Qi, t)), e.cuid = (t) => e.check(/* @__PURE__ */ ur(ra, t)), e.cuid2 = (t) => e.check(/* @__PURE__ */ dr(ia, t)), e.ulid = (t) => e.check(/* @__PURE__ */ fr(aa, t)), e.base64 = (t) => e.check(/* @__PURE__ */ yr(fa, t)), e.base64url = (t) => e.check(/* @__PURE__ */ br(pa, t)), e.xid = (t) => e.check(/* @__PURE__ */ pr(oa, t)), e.ksuid = (t) => e.check(/* @__PURE__ */ mr(sa, t)), e.ipv4 = (t) => e.check(/* @__PURE__ */ hr(ca, t)), e.ipv6 = (t) => e.check(/* @__PURE__ */ gr(la, t)), e.cidrv4 = (t) => e.check(/* @__PURE__ */ _r(ua, t)), e.cidrv6 = (t) => e.check(/* @__PURE__ */ vr(da, t)), e.e164 = (t) => e.check(/* @__PURE__ */ xr(ma, t)), e.datetime = (t) => e.check(ki(t)), e.date = (t) => e.check(ji(t)), e.time = (t) => e.check(Ni(t)), e.duration = (t) => e.check(Fi(t));
});
function R(e) {
	return /* @__PURE__ */ er(Xi, e);
}
var z = /* @__PURE__ */ h("ZodStringFormat", (e, t) => {
	j.init(e, t), Yi.init(e, t);
}), Zi = /* @__PURE__ */ h("ZodEmail", (e, t) => {
	Ut.init(e, t), z.init(e, t);
}), Qi = /* @__PURE__ */ h("ZodGUID", (e, t) => {
	Vt.init(e, t), z.init(e, t);
}), $i = /* @__PURE__ */ h("ZodUUID", (e, t) => {
	Ht.init(e, t), z.init(e, t);
}), ea = /* @__PURE__ */ h("ZodURL", (e, t) => {
	Wt.init(e, t), z.init(e, t);
}), ta = /* @__PURE__ */ h("ZodEmoji", (e, t) => {
	Gt.init(e, t), z.init(e, t);
}), na = /* @__PURE__ */ h("ZodNanoID", (e, t) => {
	Kt.init(e, t), z.init(e, t);
}), ra = /* @__PURE__ */ h("ZodCUID", (e, t) => {
	qt.init(e, t), z.init(e, t);
}), ia = /* @__PURE__ */ h("ZodCUID2", (e, t) => {
	Jt.init(e, t), z.init(e, t);
}), aa = /* @__PURE__ */ h("ZodULID", (e, t) => {
	Yt.init(e, t), z.init(e, t);
}), oa = /* @__PURE__ */ h("ZodXID", (e, t) => {
	Xt.init(e, t), z.init(e, t);
}), sa = /* @__PURE__ */ h("ZodKSUID", (e, t) => {
	Zt.init(e, t), z.init(e, t);
}), ca = /* @__PURE__ */ h("ZodIPv4", (e, t) => {
	nn.init(e, t), z.init(e, t);
}), la = /* @__PURE__ */ h("ZodIPv6", (e, t) => {
	rn.init(e, t), z.init(e, t);
}), ua = /* @__PURE__ */ h("ZodCIDRv4", (e, t) => {
	an.init(e, t), z.init(e, t);
}), da = /* @__PURE__ */ h("ZodCIDRv6", (e, t) => {
	on.init(e, t), z.init(e, t);
}), fa = /* @__PURE__ */ h("ZodBase64", (e, t) => {
	cn.init(e, t), z.init(e, t);
}), pa = /* @__PURE__ */ h("ZodBase64URL", (e, t) => {
	un.init(e, t), z.init(e, t);
}), ma = /* @__PURE__ */ h("ZodE164", (e, t) => {
	dn.init(e, t), z.init(e, t);
}), ha = /* @__PURE__ */ h("ZodJWT", (e, t) => {
	pn.init(e, t), z.init(e, t);
}), ga = /* @__PURE__ */ h("ZodNumber", (e, t) => {
	mn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => ci(e, t, n, r), e.gt = (t, n) => e.check(/* @__PURE__ */ Pr(t, n)), e.gte = (t, n) => e.check(/* @__PURE__ */ Fr(t, n)), e.min = (t, n) => e.check(/* @__PURE__ */ Fr(t, n)), e.lt = (t, n) => e.check(/* @__PURE__ */ Mr(t, n)), e.lte = (t, n) => e.check(/* @__PURE__ */ Nr(t, n)), e.max = (t, n) => e.check(/* @__PURE__ */ Nr(t, n)), e.int = (t) => e.check(ya(t)), e.safe = (t) => e.check(ya(t)), e.positive = (t) => e.check(/* @__PURE__ */ Pr(0, t)), e.nonnegative = (t) => e.check(/* @__PURE__ */ Fr(0, t)), e.negative = (t) => e.check(/* @__PURE__ */ Mr(0, t)), e.nonpositive = (t) => e.check(/* @__PURE__ */ Nr(0, t)), e.multipleOf = (t, n) => e.check(/* @__PURE__ */ Ir(t, n)), e.step = (t, n) => e.check(/* @__PURE__ */ Ir(t, n)), e.finite = () => e;
	let n = e._zod.bag;
	e.minValue = Math.max(n.minimum ?? -Infinity, n.exclusiveMinimum ?? -Infinity) ?? null, e.maxValue = Math.min(n.maximum ?? Infinity, n.exclusiveMaximum ?? Infinity) ?? null, e.isInt = (n.format ?? "").includes("int") || Number.isSafeInteger(n.multipleOf ?? .5), e.isFinite = !0, e.format = n.format ?? null;
});
function _a(e) {
	return /* @__PURE__ */ Dr(ga, e);
}
var va = /* @__PURE__ */ h("ZodNumberFormat", (e, t) => {
	hn.init(e, t), ga.init(e, t);
});
function ya(e) {
	return /* @__PURE__ */ Or(va, e);
}
var ba = /* @__PURE__ */ h("ZodBoolean", (e, t) => {
	gn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => li(e, t, n, r);
});
function xa(e) {
	return /* @__PURE__ */ kr(ba, e);
}
var Sa = /* @__PURE__ */ h("ZodUnknown", (e, t) => {
	_n.init(e, t), L.init(e, t), e._zod.processJSONSchema = (e, t, n) => void 0;
});
function Ca() {
	return /* @__PURE__ */ Ar(Sa);
}
var wa = /* @__PURE__ */ h("ZodNever", (e, t) => {
	vn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => ui(e, t, n, r);
});
function Ta(e) {
	return /* @__PURE__ */ jr(wa, e);
}
var Ea = /* @__PURE__ */ h("ZodArray", (e, t) => {
	bn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => hi(e, t, n, r), e.element = t.element, e.min = (t, n) => e.check(/* @__PURE__ */ Rr(t, n)), e.nonempty = (t) => e.check(/* @__PURE__ */ Rr(1, t)), e.max = (t, n) => e.check(/* @__PURE__ */ Lr(t, n)), e.length = (t, n) => e.check(/* @__PURE__ */ zr(t, n)), e.unwrap = () => e.element;
});
function B(e, t) {
	return /* @__PURE__ */ Zr(Ea, e, t);
}
var Da = /* @__PURE__ */ h("ZodObject", (e, t) => {
	Tn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => gi(e, t, n, r), v(e, "shape", () => t.shape), e.keyof = () => H(Object.keys(e._zod.def.shape)), e.catchall = (t) => e.clone({
		...e._zod.def,
		catchall: t
	}), e.passthrough = () => e.clone({
		...e._zod.def,
		catchall: Ca()
	}), e.loose = () => e.clone({
		...e._zod.def,
		catchall: Ca()
	}), e.strict = () => e.clone({
		...e._zod.def,
		catchall: Ta()
	}), e.strip = () => e.clone({
		...e._zod.def,
		catchall: void 0
	}), e.extend = (t) => be(e, t), e.safeExtend = (t) => xe(e, t), e.merge = (t) => Se(e, t), e.pick = (t) => ve(e, t), e.omit = (t) => ye(e, t), e.partial = (...t) => Ce(za, e, t[0]), e.required = (...t) => we(Ya, e, t[0]);
});
function V(e, t) {
	return new Da({
		type: "object",
		shape: e ?? {},
		...w(t)
	});
}
var Oa = /* @__PURE__ */ h("ZodUnion", (e, t) => {
	Dn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => _i(e, t, n, r), e.options = t.options;
});
function ka(e, t) {
	return new Oa({
		type: "union",
		options: e,
		...w(t)
	});
}
var Aa = /* @__PURE__ */ h("ZodIntersection", (e, t) => {
	On.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => vi(e, t, n, r);
});
function ja(e, t) {
	return new Aa({
		type: "intersection",
		left: e,
		right: t
	});
}
var Ma = /* @__PURE__ */ h("ZodRecord", (e, t) => {
	jn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => yi(e, t, n, r), e.keyType = t.keyType, e.valueType = t.valueType;
});
function Na(e, t, n) {
	return new Ma({
		type: "record",
		keyType: e,
		valueType: t,
		...w(n)
	});
}
var Pa = /* @__PURE__ */ h("ZodEnum", (e, t) => {
	Mn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => di(e, t, n, r), e.enum = t.entries, e.options = Object.values(t.entries);
	let n = new Set(Object.keys(t.entries));
	e.extract = (e, r) => {
		let i = {};
		for (let r of e) if (n.has(r)) i[r] = t.entries[r];
		else throw Error(`Key ${r} not found in enum`);
		return new Pa({
			...t,
			checks: [],
			...w(r),
			entries: i
		});
	}, e.exclude = (e, r) => {
		let i = { ...t.entries };
		for (let t of e) if (n.has(t)) delete i[t];
		else throw Error(`Key ${t} not found in enum`);
		return new Pa({
			...t,
			checks: [],
			...w(r),
			entries: i
		});
	};
});
function H(e, t) {
	return new Pa({
		type: "enum",
		entries: Array.isArray(e) ? Object.fromEntries(e.map((e) => [e, e])) : e,
		...w(t)
	});
}
var Fa = /* @__PURE__ */ h("ZodLiteral", (e, t) => {
	Nn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => fi(e, t, n, r), e.values = new Set(t.values), Object.defineProperty(e, "value", { get() {
		if (t.values.length > 1) throw Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return t.values[0];
	} });
});
function Ia(e, t) {
	return new Fa({
		type: "literal",
		values: Array.isArray(e) ? e : [e],
		...w(t)
	});
}
var La = /* @__PURE__ */ h("ZodTransform", (e, t) => {
	Pn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => mi(e, t, n, r), e._zod.parse = (n, r) => {
		if (r.direction === "backward") throw new ee(e.constructor.name);
		n.addIssue = (r) => {
			if (typeof r == "string") n.issues.push(O(r, n.value, t));
			else {
				let t = r;
				t.fatal && (t.continue = !1), t.code ??= "custom", t.input ??= n.value, t.inst ??= e, n.issues.push(O(t));
			}
		};
		let i = t.transform(n.value, n);
		return i instanceof Promise ? i.then((e) => (n.value = e, n)) : (n.value = i, n);
	};
});
function Ra(e) {
	return new La({
		type: "transform",
		transform: e
	});
}
var za = /* @__PURE__ */ h("ZodOptional", (e, t) => {
	In.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Di(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ba(e) {
	return new za({
		type: "optional",
		innerType: e
	});
}
var Va = /* @__PURE__ */ h("ZodExactOptional", (e, t) => {
	Ln.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Di(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ha(e) {
	return new Va({
		type: "optional",
		innerType: e
	});
}
var Ua = /* @__PURE__ */ h("ZodNullable", (e, t) => {
	Rn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => bi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Wa(e) {
	return new Ua({
		type: "nullable",
		innerType: e
	});
}
var Ga = /* @__PURE__ */ h("ZodDefault", (e, t) => {
	zn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Si(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeDefault = e.unwrap;
});
function Ka(e, t) {
	return new Ga({
		type: "default",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : me(t);
		}
	});
}
var qa = /* @__PURE__ */ h("ZodPrefault", (e, t) => {
	Vn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ci(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Ja(e, t) {
	return new qa({
		type: "prefault",
		innerType: e,
		get defaultValue() {
			return typeof t == "function" ? t() : me(t);
		}
	});
}
var Ya = /* @__PURE__ */ h("ZodNonOptional", (e, t) => {
	Hn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => xi(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function Xa(e, t) {
	return new Ya({
		type: "nonoptional",
		innerType: e,
		...w(t)
	});
}
var Za = /* @__PURE__ */ h("ZodCatch", (e, t) => {
	Wn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => wi(e, t, n, r), e.unwrap = () => e._zod.def.innerType, e.removeCatch = e.unwrap;
});
function Qa(e, t) {
	return new Za({
		type: "catch",
		innerType: e,
		catchValue: typeof t == "function" ? t : () => t
	});
}
var $a = /* @__PURE__ */ h("ZodPipe", (e, t) => {
	Gn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ti(e, t, n, r), e.in = t.in, e.out = t.out;
});
function eo(e, t) {
	return new $a({
		type: "pipe",
		in: e,
		out: t
	});
}
var to = /* @__PURE__ */ h("ZodReadonly", (e, t) => {
	qn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => Ei(e, t, n, r), e.unwrap = () => e._zod.def.innerType;
});
function no(e) {
	return new to({
		type: "readonly",
		innerType: e
	});
}
var ro = /* @__PURE__ */ h("ZodCustom", (e, t) => {
	Yn.init(e, t), L.init(e, t), e._zod.processJSONSchema = (t, n, r) => pi(e, t, n, r);
});
function io(e, t = {}) {
	return /* @__PURE__ */ Qr(ro, e, t);
}
function ao(e) {
	return /* @__PURE__ */ $r(e);
}
//#endregion
//#region electron/database.ts
var oo = V({
	id: R(),
	endpoint: R(),
	apiKey: R(),
	defaultModel: R(),
	isEnabled: xa(),
	note: R()
}), so = V({
	outputDirectory: R(),
	defaultProviderId: R(),
	defaultImageCount: _a().int().min(1).max(4),
	defaultCanvasSize: R(),
	appearance: Ia("light"),
	futureAuthEnabled: xa()
}), co = V({
	id: R().optional(),
	themeId: R().min(1),
	name: R().min(1),
	description: R().min(1),
	mode: H(["text-to-image", "image-to-image"]),
	promptTemplate: R().min(1),
	negativePromptTemplate: R(),
	starterText: R().min(1)
}), lo = V({
	id: R().optional(),
	name: R().min(1),
	description: R().min(1)
}), uo = V({
	providerId: R(),
	presetId: R(),
	mode: H(["text-to-image", "image-to-image"]),
	values: Na(R(), ka([R(), _a()])),
	imageCount: _a().int().min(1).max(4),
	referenceImagePath: R().optional(),
	referenceImagePaths: B(R()).optional()
}), fo = V({ job: V({
	id: R(),
	providerId: R(),
	providerName: R(),
	presetId: R().nullable(),
	presetName: R(),
	mode: H(["text-to-image", "image-to-image"]),
	prompt: R(),
	negativePrompt: R(),
	status: H([
		"queued",
		"running",
		"completed",
		"failed"
	]),
	params: Na(R(), ka([R(), _a()])),
	resultPaths: B(R()),
	resultUrls: B(R()),
	referenceImageUrl: R().nullable(),
	referenceImageUrls: B(R()),
	referenceImagePaths: B(R()),
	errorMessage: R().nullable(),
	createdAt: R(),
	updatedAt: R()
}) }), po = V({ id: R() }), U = "https://ai.krapi.cn", W = "kr-gemini-images", mo = "kr-gpt-images", ho = "【T】香蕉pro", go = class {
	db;
	constructor(e) {
		this.options = e, t.mkdirSync(n.dirname(e.dbPath), { recursive: !0 }), t.mkdirSync(e.defaultOutputDirectory, { recursive: !0 }), this.db = new m(e.dbPath), this.db.pragma("journal_mode = WAL"), this.createTables(), this.migrate(), this.seed();
	}
	bootstrap() {
		let e = this.db.prepare("SELECT * FROM providers ORDER BY rowid ASC").all(), t = this.db.prepare("SELECT * FROM preset_themes ORDER BY updatedAt DESC, createdAt DESC").all(), n = this.db.prepare("SELECT * FROM presets ORDER BY updatedAt DESC").all(), r = this.db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all(), i = this.getSettings();
		return {
			providers: e.map((e) => ({
				...e,
				isEnabled: !!e.isEnabled,
				capabilities: JSON.parse(e.capabilities)
			})),
			presetThemes: t,
			presets: n.map((e) => ({
				...e,
				fields: JSON.parse(e.fields),
				defaults: JSON.parse(e.defaults)
			})),
			jobs: r.map((t) => this.mapJobRow(t, e, n)),
			settings: {
				...i,
				futureAuthEnabled: !!i.futureAuthEnabled
			},
			workspaceState: this.getWorkspaceState(),
			setupGuide: [
				{
					title: "Install Node.js LTS",
					description: "Install Node.js, then check the version in PowerShell.",
					command: "node -v"
				},
				{
					title: "Install VS Code",
					description: "Use it to open the project and run terminal commands."
				},
				{
					title: "Install Git",
					description: "Use it to keep your code history safe.",
					command: "git --version"
				},
				{
					title: "Install DB Browser for SQLite",
					description: "Use it to inspect local history and presets."
				},
				{
					title: "Start the app",
					description: "Run the following command inside the project folder.",
					command: "npm.cmd install && npm.cmd run dev"
				}
			]
		};
	}
	saveProvider(e) {
		let t = oo.parse(e), n = t.defaultModel.trim(), r = t.endpoint.trim() || U;
		return this.db.prepare("UPDATE providers SET endpoint = ?, apiKey = ?, defaultModel = ?, isEnabled = ?, note = ? WHERE id = ?").run(r, t.apiKey, n, Number(t.isEnabled), t.note, t.id), t.isEnabled && this.db.prepare("UPDATE settings SET defaultProviderId = ?").run(t.id), this.bootstrap().providers.find((e) => e.id === t.id);
	}
	saveSettings(e) {
		let t = so.parse(e);
		return this.db.prepare("DELETE FROM settings").run(), this.db.prepare("INSERT INTO settings (outputDirectory, defaultProviderId, defaultImageCount, defaultCanvasSize, appearance, futureAuthEnabled) VALUES (?, ?, ?, ?, ?, ?)").run(t.outputDirectory, t.defaultProviderId, t.defaultImageCount, t.defaultCanvasSize, t.appearance, Number(t.futureAuthEnabled)), this.bootstrap().settings;
	}
	savePresetTheme(e) {
		let t = lo.parse(e), n = (/* @__PURE__ */ new Date()).toISOString(), r = t.id ?? `theme-${crypto.randomUUID()}`;
		return this.db.prepare("INSERT INTO preset_themes (id, name, description, createdAt, updatedAt)\n         VALUES (?, ?, ?, ?, ?)\n         ON CONFLICT(id) DO UPDATE SET\n           name = excluded.name,\n           description = excluded.description,\n           updatedAt = excluded.updatedAt").run(r, t.name, t.description, n, n), this.bootstrap().presetThemes.find((e) => e.id === r);
	}
	deletePresetTheme(e) {
		this.db.prepare("DELETE FROM presets WHERE themeId = ?").run(e), this.db.prepare("DELETE FROM preset_themes WHERE id = ?").run(e);
	}
	saveWorkspaceState(e) {
		let t = (/* @__PURE__ */ new Date()).toISOString();
		return this.db.prepare("DELETE FROM workspace_state").run(), this.db.prepare("INSERT INTO workspace_state (id, payload, updatedAt) VALUES (1, ?, ?)").run(JSON.stringify(e), t), this.getWorkspaceState();
	}
	savePreset(e) {
		let t = co.parse(e), n = (/* @__PURE__ */ new Date()).toISOString(), r = t.id ?? `custom-${crypto.randomUUID()}`;
		return this.db.prepare("INSERT INTO presets (id, themeId, name, description, mode, promptTemplate, negativePromptTemplate, starterText, fields, defaults, createdAt, updatedAt)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n         ON CONFLICT(id) DO UPDATE SET\n           themeId = excluded.themeId,\n           name = excluded.name,\n           description = excluded.description,\n           mode = excluded.mode,\n           promptTemplate = excluded.promptTemplate,\n           negativePromptTemplate = excluded.negativePromptTemplate,\n           starterText = excluded.starterText,\n           updatedAt = excluded.updatedAt").run(r, t.themeId, t.name, t.description, t.mode, t.promptTemplate, t.negativePromptTemplate, t.starterText, JSON.stringify([{
			key: "subject",
			label: "Subject",
			type: "text",
			placeholder: "Describe what you want to make"
		}, {
			key: "style",
			label: "Style",
			type: "text",
			placeholder: "Describe the target style"
		}]), JSON.stringify({
			subject: t.starterText,
			style: ""
		}), n, n), this.bootstrap().presets.find((e) => e.id === r);
	}
	deletePreset(e) {
		this.db.prepare("DELETE FROM presets WHERE id = ?").run(e);
	}
	async generateArtwork(e) {
		let t = uo.parse(e), n = this.bootstrap().providers.find((e) => e.id === t.providerId), r = this.bootstrap().presets.find((e) => e.id === t.presetId), i = bo(t.referenceImagePaths, t.referenceImagePath);
		if (!n) throw Error("Provider not found.");
		if (!n.isEnabled) throw Error("This provider is disabled.");
		let a = So(r?.promptTemplate ?? "{{subject}}", t.values), o = r?.negativePromptTemplate ?? "", s = this.options.defaultOutputDirectory, c;
		c = n.kind === "demo" ? await new _o(s).generate({
			prompt: a,
			mode: t.mode,
			values: t.values,
			imageCount: t.imageCount,
			referenceImagePaths: i
		}) : n.kind === "kr-gemini-images" || n.kind === "kr-gpt-images" ? await new vo({
			endpoint: n.endpoint,
			apiKey: n.apiKey,
			defaultModel: n.defaultModel,
			channel: n.kind === "kr-gpt-images" ? "GPT" : "Gemini",
			outputDirectory: s
		}).generate({
			prompt: a,
			mode: t.mode,
			values: t.values,
			imageCount: t.imageCount,
			referenceImagePaths: i
		}) : await new yo(n.name).generate();
		let l = (/* @__PURE__ */ new Date()).toISOString(), u = {
			id: crypto.randomUUID(),
			providerId: n.id,
			presetId: r?.id ?? null,
			mode: t.mode,
			prompt: a,
			negativePrompt: o,
			params: JSON.stringify(t.values),
			status: "completed",
			resultPaths: JSON.stringify(c.resultPaths),
			referenceImagePath: i[0] ?? null,
			referenceImagePaths: JSON.stringify(i),
			errorMessage: null,
			createdAt: l,
			updatedAt: l
		}, d = this.db.prepare("SELECT * FROM providers ORDER BY rowid ASC").all(), f = this.db.prepare("SELECT * FROM presets ORDER BY updatedAt DESC").all();
		return { job: this.mapJobRow(u, d, f) };
	}
	saveHistoryJob(e) {
		let t = fo.parse(e).job;
		return this.db.prepare("INSERT INTO jobs (id, providerId, presetId, mode, prompt, negativePrompt, params, status, resultPaths, referenceImagePath, referenceImagePaths, errorMessage, createdAt, updatedAt)\n         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n         ON CONFLICT(id) DO UPDATE SET\n           providerId = excluded.providerId,\n           presetId = excluded.presetId,\n           mode = excluded.mode,\n           prompt = excluded.prompt,\n           negativePrompt = excluded.negativePrompt,\n           params = excluded.params,\n           status = excluded.status,\n           resultPaths = excluded.resultPaths,\n           referenceImagePath = excluded.referenceImagePath,\n           referenceImagePaths = excluded.referenceImagePaths,\n           errorMessage = excluded.errorMessage,\n           updatedAt = excluded.updatedAt").run(t.id, t.providerId, t.presetId, t.mode, t.prompt, t.negativePrompt, JSON.stringify(t.params), t.status, JSON.stringify(t.resultPaths), t.referenceImagePaths[0] ?? null, JSON.stringify(t.referenceImagePaths), t.errorMessage, t.createdAt, (/* @__PURE__ */ new Date()).toISOString()), { job: this.bootstrap().jobs.find((e) => e.id === t.id) ?? t };
	}
	deleteHistoryJob(e) {
		let t = po.parse(e);
		this.db.prepare("DELETE FROM jobs WHERE id = ?").run(t.id);
	}
	createTables() {
		this.db.exec("\n      CREATE TABLE IF NOT EXISTS providers (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        kind TEXT NOT NULL,\n        endpoint TEXT NOT NULL,\n        apiKey TEXT NOT NULL,\n        defaultModel TEXT NOT NULL,\n        isEnabled INTEGER NOT NULL DEFAULT 1,\n        capabilities TEXT NOT NULL,\n        note TEXT NOT NULL\n      );\n      CREATE TABLE IF NOT EXISTS preset_themes (\n        id TEXT PRIMARY KEY,\n        name TEXT NOT NULL,\n        description TEXT NOT NULL,\n        createdAt TEXT NOT NULL,\n        updatedAt TEXT NOT NULL\n      );\n      CREATE TABLE IF NOT EXISTS presets (\n        id TEXT PRIMARY KEY,\n        themeId TEXT NOT NULL DEFAULT '',\n        name TEXT NOT NULL,\n        description TEXT NOT NULL,\n        mode TEXT NOT NULL,\n        promptTemplate TEXT NOT NULL,\n        negativePromptTemplate TEXT NOT NULL,\n        starterText TEXT NOT NULL DEFAULT '',\n        fields TEXT NOT NULL,\n        defaults TEXT NOT NULL,\n        createdAt TEXT NOT NULL,\n        updatedAt TEXT NOT NULL\n      );\n      CREATE TABLE IF NOT EXISTS jobs (\n        id TEXT PRIMARY KEY,\n        providerId TEXT NOT NULL,\n        presetId TEXT,\n        mode TEXT NOT NULL,\n        prompt TEXT NOT NULL,\n        negativePrompt TEXT NOT NULL,\n        params TEXT NOT NULL,\n        status TEXT NOT NULL,\n        resultPaths TEXT NOT NULL,\n        referenceImagePath TEXT,\n        referenceImagePaths TEXT NOT NULL DEFAULT '[]',\n        errorMessage TEXT,\n        createdAt TEXT NOT NULL,\n        updatedAt TEXT NOT NULL\n      );\n      CREATE TABLE IF NOT EXISTS settings (\n        outputDirectory TEXT NOT NULL,\n        defaultProviderId TEXT NOT NULL,\n        defaultImageCount INTEGER NOT NULL,\n        defaultCanvasSize TEXT NOT NULL,\n        appearance TEXT NOT NULL,\n        futureAuthEnabled INTEGER NOT NULL\n      );\n      CREATE TABLE IF NOT EXISTS workspace_state (\n        id INTEGER PRIMARY KEY CHECK (id = 1),\n        payload TEXT NOT NULL,\n        updatedAt TEXT NOT NULL\n      );\n    ");
	}
	migrate() {
		this.db.prepare("PRAGMA table_info(jobs)").all().some((e) => e.name === "referenceImagePaths") || this.db.prepare("ALTER TABLE jobs ADD COLUMN referenceImagePaths TEXT NOT NULL DEFAULT '[]'").run();
		let e = this.db.prepare("PRAGMA table_info(presets)").all();
		e.some((e) => e.name === "themeId") || this.db.prepare("ALTER TABLE presets ADD COLUMN themeId TEXT NOT NULL DEFAULT ''").run(), e.some((e) => e.name === "starterText") || this.db.prepare("ALTER TABLE presets ADD COLUMN starterText TEXT NOT NULL DEFAULT ''").run();
	}
	seed() {
		let e = this.db.prepare("INSERT OR REPLACE INTO providers (id, name, kind, endpoint, apiKey, defaultModel, isEnabled, capabilities, note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"), t = this.db.prepare("INSERT OR REPLACE INTO preset_themes (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)");
		this.db.prepare("DELETE FROM providers WHERE id NOT IN (?, ?)").run(W, mo);
		let n = (/* @__PURE__ */ new Date()).toISOString();
		if (t.run("theme-commercial", "电商视觉", "适合主图、商详和产品改图的提示词主题。", n, n), t.run("theme-creative", "创意表达", "适合海报、氛围图和风格化创作的提示词主题。", n, n), this.db.prepare("SELECT 1 FROM providers WHERE id = ?").get(W) || e.run(W, "Gemini", "kr-gemini-images", U, "", ho, 1, JSON.stringify(["text-to-image", "image-to-image"]), "Kr Gemini image relay channel."), !this.db.prepare("SELECT 1 FROM providers WHERE id = ?").get(mo)) {
			let t = this.db.prepare("SELECT endpoint, apiKey FROM providers WHERE id = ?").get(W);
			e.run(mo, "GPT", "kr-gpt-images", t?.endpoint || U, t?.apiKey || "", "gpt-image-2", 1, JSON.stringify(["text-to-image", "image-to-image"]), "Kr GPT image relay channel.");
		}
		let r = this.db.prepare("SELECT defaultModel, endpoint FROM providers WHERE id = ?").get(W);
		if (r) {
			let e = Do(r.defaultModel);
			this.db.prepare("UPDATE providers SET defaultModel = ? WHERE id = ?").run(e, W), this.db.prepare("UPDATE providers SET endpoint = ?, isEnabled = 1 WHERE id = ?").run(U, W);
		}
		this.db.prepare("SELECT endpoint FROM providers WHERE id = ?").get(mo) && this.db.prepare("UPDATE providers SET endpoint = ?, defaultModel = ?, isEnabled = 1 WHERE id = ?").run(U, "gpt-image-2", mo);
		let i = this.db.prepare("INSERT INTO presets (id, themeId, name, description, mode, promptTemplate, negativePromptTemplate, starterText, fields, defaults, createdAt, updatedAt)\n       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\n       ON CONFLICT(id) DO UPDATE SET\n         themeId = excluded.themeId,\n         name = excluded.name,\n         description = excluded.description,\n         mode = excluded.mode,\n         promptTemplate = excluded.promptTemplate,\n         negativePromptTemplate = excluded.negativePromptTemplate,\n         starterText = excluded.starterText,\n         fields = excluded.fields,\n         defaults = excluded.defaults,\n         updatedAt = excluded.updatedAt");
		if (i.run("preset-cover", "theme-commercial", "海报主视觉", "适合封面、KV 和主视觉方向的常用内容。", "text-to-image", "{{subject}}", "", "一台放在白色桌面的未来感设备", JSON.stringify([{
			key: "subject",
			label: "主题",
			type: "text",
			placeholder: "输入主题"
		}]), JSON.stringify({ subject: "一台放在白色桌面的未来感设备" }), n, n), i.run("preset-remix", "theme-commercial", "参考图重绘", "适合保持主体关键特征继续改图的内容。", "image-to-image", "{{subject}}", "", "保持主体关键特征，提升材质、光影与高级感", JSON.stringify([{
			key: "subject",
			label: "编辑目标",
			type: "text",
			placeholder: "输入改图目标"
		}]), JSON.stringify({ subject: "保持主体关键特征，提升材质、光影与高级感" }), n, n), this.db.prepare("SELECT COUNT(*) as count FROM settings").get().count === 0) this.db.prepare("INSERT INTO settings (outputDirectory, defaultProviderId, defaultImageCount, defaultCanvasSize, appearance, futureAuthEnabled) VALUES (?, ?, ?, ?, ?, ?)").run(this.options.defaultOutputDirectory, W, 2, "1024x1024", "light", 0);
		else {
			let e = this.getSettings();
			(this.db.prepare("SELECT 1 FROM providers WHERE id = ?").get(e.defaultProviderId) ?? this.db.prepare("SELECT 1 FROM providers WHERE id = ?").get(W)) || this.db.prepare("UPDATE settings SET defaultProviderId = ?").run(W);
		}
	}
	getSettings() {
		return this.db.prepare("SELECT * FROM settings LIMIT 1").get() ?? {
			outputDirectory: this.options.defaultOutputDirectory,
			defaultProviderId: W,
			defaultImageCount: 2,
			defaultCanvasSize: "1024x1024",
			appearance: "light",
			futureAuthEnabled: 0
		};
	}
	getWorkspaceState() {
		let e = this.db.prepare("SELECT * FROM workspace_state WHERE id = 1").get();
		if (!e) return null;
		let t = JSON.parse(e.payload), n = Array.isArray(t.referenceImages) ? t.referenceImages.filter((e) => e && typeof e.path == "string" && e.path).map((e) => ({
			path: e.path,
			url: p(e.path).toString()
		})) : [];
		return {
			workspaceSection: t.workspaceSection === "retouch" || t.workspaceSection === "hero-image" || t.workspaceSection === "detail-page" ? t.workspaceSection : "image-editing",
			workspaceExpanded: !!t.workspaceExpanded,
			activePresetId: String(t.activePresetId ?? ""),
			activeProviderId: String(t.activeProviderId ?? ""),
			mode: t.mode === "image-to-image" ? "image-to-image" : "text-to-image",
			values: t.values ?? {},
			imageCount: Math.max(1, Math.min(4, Number(t.imageCount ?? 2))),
			referenceImages: n,
			selectedModel: Do(t.selectedModel),
			selectedSize: String(t.selectedSize ?? "2K"),
			selectedRatio: String(t.selectedRatio ?? "4:5")
		};
	}
	mapJobRow(e, t, n) {
		let r = t.find((t) => t.id === e.providerId), i = n.find((t) => t.id === e.presetId), a = xo(e.resultPaths), o = e.referenceImagePaths ? xo(e.referenceImagePaths) : e.referenceImagePath ? [e.referenceImagePath] : [];
		return {
			...e,
			providerName: r?.name ?? e.providerId,
			presetName: i?.name ?? "Untitled preset",
			params: JSON.parse(e.params),
			resultPaths: a,
			resultUrls: a.map((e) => p(e).toString()),
			referenceImageUrl: o[0] ? p(o[0]).toString() : null,
			referenceImageUrls: o.map((e) => p(e).toString()),
			referenceImagePaths: o
		};
	}
}, _o = class {
	constructor(e) {
		this.outputDirectory = e;
	}
	async generate(e) {
		return t.mkdirSync(this.outputDirectory, { recursive: !0 }), { resultPaths: Array.from({ length: e.imageCount }, (r, i) => {
			let a = n.join(this.outputDirectory, `${Date.now()}-${i + 1}.svg`);
			return t.writeFileSync(a, Co(e.prompt, e.mode, String(e.values.style ?? "Minimal"), String(e.values.mood ?? "Clean"), e.referenceImagePaths[0]), "utf8"), a;
		}) };
	}
}, vo = class e {
	static POLL_INTERVAL_MS = 3e3;
	static MAX_POLL_ATTEMPTS = 200;
	constructor(e) {
		this.config = e;
	}
	async generate(e) {
		if (!this.config.apiKey.trim()) throw Error("尚未配置 API Key，请在 API 配置里填写。");
		t.mkdirSync(this.config.outputDirectory, { recursive: !0 });
		let n = [];
		for (let t = 0; t < e.imageCount; t += 1) try {
			let r = await this.generateSingle(e, t);
			n.push(r);
		} catch (e) {
			let r = await wo(this.config.outputDirectory, `kr-failed-${Date.now()}-${t + 1}`, "Kr generation failed", e instanceof Error ? e.message : "Unknown error");
			n.push(r);
		}
		return { resultPaths: n };
	}
	async generateSingle(e, t) {
		let n = this.config.channel === "GPT", r = To(e.values.ratio), i = Eo(e.values.size);
		return n ? this.generateGptSingle(e, t, r, i) : this.generateGeminiSingle(e, t, r, i);
	}
	async generateGeminiSingle(e, r, i, a) {
		let o = this.resolveGeminiModel(e), s = String(e.prompt ?? "").trim() || "请根据参考图生成图像";
		try {
			let r = n.join(this.config.outputDirectory, "..", "kr-adapter-debug.log"), s = `[${(/* @__PURE__ */ new Date()).toISOString()}] channel=Gemini model=${o} ratio=${i} size=${a} rawSize=${e.values.size} rawRatio=${e.values.ratio}\n`;
			t.appendFileSync(r, s);
		} catch {}
		let c = [{ text: s }];
		for (let t of e.referenceImagePaths) c.push({ inlineData: await Ho(t) });
		let l = {};
		i && i !== "auto" && (l.aspectRatio = i), a && (l.imageSize = a);
		let u = { responseModalities: ["TEXT", "IMAGE"] };
		Object.keys(l).length > 0 && (u.imageConfig = l);
		let d = {
			contents: [{
				role: "user",
				parts: c
			}],
			generationConfig: u
		}, f = `${this.config.endpoint.replace(/\/+$/, "")}/v1beta/models/${Ro(o)}:generateContent`;
		try {
			let r = n.join(this.config.outputDirectory, "..", "kr-adapter-debug.log");
			t.appendFileSync(r, `[${(/* @__PURE__ */ new Date()).toISOString()}] payload=${JSON.stringify(Io({
				...d,
				model: o
			}, e.referenceImagePaths.length, s.length))}\n`), t.appendFileSync(r, `[${(/* @__PURE__ */ new Date()).toISOString()}] endpoint=${f}\n`);
		} catch {}
		let p = await Zo(f, {
			method: "POST",
			headers: {
				Authorization: Lo(this.config.apiKey),
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify(d),
			cache: "no-store"
		}, { enableDirectRetry: !0 }), m = await p.text(), h;
		try {
			h = JSON.parse(m);
		} catch {
			throw Error(`Kr 返回了非 JSON 内容 (${p.status}): ${m.slice(0, 300)}`);
		}
		if (!p.ok) {
			let e = JSON.stringify(h).slice(0, 400);
			throw Error(`Kr request failed (${p.status}): ${e}`);
		}
		let g = Ao(h);
		if (g) return Mo(g, this.config.outputDirectory, `kr-${Date.now()}-${r + 1}`);
		let ee = this.extractTaskInfo(h);
		if (!ee) throw Error(`Kr 未返回 task_id: ${JSON.stringify(h).slice(0, 300)}`);
		return await Mo(await this.pollForResult(ee), this.config.outputDirectory, `kr-${Date.now()}-${r + 1}`);
	}
	async generateGptSingle(e, r, i, a) {
		let o = String(e.prompt ?? "").trim() || "generate image", s = ko(i, a), c = e.referenceImagePaths.length > 0, l = [];
		if (c) {
			l.push({
				type: "text",
				text: o
			});
			for (let t of e.referenceImagePaths) l.push({
				type: "image_url",
				image_url: { url: await Vo(t) }
			});
		}
		let u = {
			model: "gpt-image-2",
			messages: [{
				role: "user",
				content: c ? l : o
			}],
			size: s,
			n: 1,
			quality: Oo(e.values.quality)
		}, d = `${this.config.endpoint.replace(/\/+$/, "")}/v1/chat/completions`;
		try {
			let r = n.join(this.config.outputDirectory, "..", "kr-adapter-debug.log");
			t.appendFileSync(r, `[${(/* @__PURE__ */ new Date()).toISOString()}] channel=GPT ratio=${i} size=${a} pixelSize=${s} refs=${e.referenceImagePaths.length}\n`), t.appendFileSync(r, `[${(/* @__PURE__ */ new Date()).toISOString()}] payload=${JSON.stringify(Io(u, e.referenceImagePaths.length, o.length))}\n`), t.appendFileSync(r, `[${(/* @__PURE__ */ new Date()).toISOString()}] endpoint=${d}\n`);
		} catch {}
		let f = await Zo(d, {
			method: "POST",
			headers: {
				Authorization: Lo(this.config.apiKey),
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify(u),
			cache: "no-store"
		}, { enableDirectRetry: !0 }), p = await f.text(), m;
		try {
			m = JSON.parse(p);
		} catch {
			throw Error(`Kr GPT 返回了非 JSON 内容 (${f.status}): ${p.slice(0, 300)}`);
		}
		if (!f.ok) {
			let e = JSON.stringify(m).slice(0, 400);
			throw Error(`Kr GPT request failed (${f.status}): ${e}`);
		}
		let h = Ao(m);
		if (h) return Mo(h, this.config.outputDirectory, `kr-${Date.now()}-${r + 1}`);
		let g = this.extractTaskInfo(m);
		if (!g) throw Error(`Kr GPT 未返回 task_id: ${JSON.stringify(m).slice(0, 300)}`);
		return await Mo(await this.pollForResult(g), this.config.outputDirectory, `kr-${Date.now()}-${r + 1}`);
	}
	resolveGeminiModel(e) {
		return String(e.values.model ?? "").trim() || Do(String(this.config.defaultModel ?? "").trim());
	}
	extractTaskInfo(e) {
		let t = typeof e.task_id == "string" ? e.task_id : typeof e.id == "string" ? e.id : "", n = typeof e.query_url == "string" ? e.query_url : "";
		try {
			let r = e.choices?.[0]?.message?.content, i = typeof r == "string" && r.trim().startsWith("{") ? JSON.parse(r) : typeof r == "object" && r ? r : null;
			i && (!t && typeof i.task_id == "string" && (t = i.task_id), !t && typeof i.id == "string" && (t = i.id), !n && typeof i.query_url == "string" && (n = i.query_url));
		} catch {}
		return t = t.trim(), n = n.trim(), !t && !n ? null : {
			taskId: t,
			queryUrl: n || (t ? this.buildTaskPollUrl(t) : void 0)
		};
	}
	buildTaskPollUrl(e) {
		return `${this.config.endpoint.replace(/\/+$/, "")}/v1/images/tasks/${encodeURIComponent(e)}`;
	}
	async pollForResult(t) {
		let n = t.queryUrl || this.buildTaskPollUrl(t.taskId);
		for (let t = 0; t < e.MAX_POLL_ATTEMPTS; t += 1) {
			await ts(t === 0 ? 1500 : e.POLL_INTERVAL_MS);
			let r = await Zo(n, {
				headers: {
					Authorization: Lo(this.config.apiKey),
					Accept: "application/json"
				},
				cache: "no-store"
			}, { enableDirectRetry: !0 }), i = await r.text(), a;
			try {
				a = JSON.parse(i);
			} catch {
				continue;
			}
			if (!r.ok) throw Error(`Kr 查询任务失败 (${r.status}): ${Jo(a)}`);
			let o = String(a.status ?? "").toLowerCase();
			if ([
				"completed",
				"done",
				"success",
				"succeeded"
			].includes(o)) {
				let e = Ao(a);
				if (e) return e;
				let t = No(a);
				if (t) return {
					kind: "url",
					value: t
				};
				throw Error("Kr 任务完成但未返回图片 URL。");
			}
			if ([
				"failed",
				"error",
				"canceled",
				"cancelled"
			].includes(o)) throw Error(`Kr 生成失败: ${Jo(a)}`);
			if (o === "not_found_or_expired") throw Error("Kr 任务不存在或已过期。");
		}
		throw Error("Kr 生成超时，请稍后重试。");
	}
}, yo = class {
	constructor(e) {
		this.providerName = e;
	}
	async generate() {
		throw Error(`${this.providerName} 暂不支持，请切换到 Kr 渠道。`);
	}
};
function bo(e, t) {
	return e && e.length > 0 ? Array.from(new Set(e.filter(Boolean))) : t ? [t] : [];
}
function xo(e) {
	try {
		let t = JSON.parse(e);
		return Array.isArray(t) ? t.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function So(e, t) {
	return e.replaceAll(/\{\{(.*?)\}\}/g, (e, n) => String(t[n.trim()] ?? ""));
}
function Co(e, t, n, r, i) {
	let a = G(e);
	return `<?xml version="1.0" encoding="UTF-8"?><svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="120" y1="80" x2="900" y2="980" gradientUnits="userSpaceOnUse"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#dbe4f2"/></linearGradient><radialGradient id="orb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(220 220) rotate(45) scale(380)"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#cbd5e1"/></radialGradient></defs><rect width="1024" height="1024" rx="64" fill="url(#bg)"/><circle cx="240" cy="220" r="220" fill="url(#orb)" fill-opacity="0.95"/><circle cx="820" cy="180" r="120" fill="#ffffff" fill-opacity="0.6"/><rect x="96" y="112" width="832" height="800" rx="42" fill="#ffffff" fill-opacity="0.76" stroke="#d7deea"/><text x="152" y="206" fill="#94a3b8" font-size="28" font-family="Arial">Codex Art Studio Demo Render</text><text x="152" y="266" fill="#0f172a" font-size="52" font-family="Arial" font-weight="700">${t === "image-to-image" ? "Image edit" : "Text to image"}</text><text x="152" y="332" fill="#334155" font-size="28" font-family="Arial">Style: ${G(n)}</text><text x="152" y="378" fill="#334155" font-size="28" font-family="Arial">Mood: ${G(r)}</text><foreignObject x="152" y="438" width="720" height="250"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 28px; color: #1e293b; line-height: 1.55;">${a}</div></foreignObject><rect x="152" y="748" width="720" height="92" rx="24" fill="#f8fafc" stroke="#d7deea"/><text x="184" y="804" fill="#64748b" font-size="24" font-family="Arial">Reference: ${G(i ?? "No reference image")}</text></svg>`;
}
async function wo(e, r, i, a) {
	let o = G(i), s = G(a.slice(0, 220)), c = n.join(e, `${r}.svg`), l = `<?xml version="1.0" encoding="UTF-8"?><svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bg" x1="128" y1="64" x2="896" y2="960" gradientUnits="userSpaceOnUse"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f6f8fc"/></linearGradient></defs><rect width="1024" height="1024" rx="56" fill="url(#bg)"/><rect x="88" y="88" width="848" height="848" rx="40" fill="#ffffff" stroke="#e2e8f0" stroke-dasharray="14 12"/><circle cx="512" cy="324" r="96" fill="#f8d7da"/><path d="M470 282L554 366M554 282L470 366" stroke="#b42318" stroke-width="22" stroke-linecap="round"/><text x="512" y="520" text-anchor="middle" fill="#0f172a" font-size="56" font-family="Arial" font-weight="700">${o}</text><foreignObject x="172" y="570" width="680" height="180"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial; font-size: 28px; color: #64748b; line-height: 1.6; text-align: center; word-break: break-word;">${s}</div></foreignObject></svg>`;
	return await t.promises.writeFile(c, l, "utf8"), c;
}
function G(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
}
function To(e) {
	let t = String(e ?? "").trim();
	return t.includes(":") ? t : "auto";
}
function Eo(e) {
	let t = String(e ?? "").trim().toUpperCase();
	if (t === "1K" || t === "2K" || t === "4K") return t;
}
function Do(e) {
	let t = String(e ?? "").trim();
	return !t || t === "gemini-3.1-flash-image-preview" || t === "gemini-3.1-pro-preview" ? ho : t;
}
function Oo(e) {
	let t = String(e ?? "").trim().toLowerCase();
	return t === "medium" || t === "中等" ? "medium" : t === "low" || t === "低" ? "low" : t === "auto" || t === "自动" ? "auto" : "high";
}
function ko(e, t) {
	let n = {
		"1K": 1048576,
		"2K": 4194304,
		"4K": 8294400
	}, r = 3840, i = !e || e === "auto" ? "1:1" : e, a = t && n[t] ? t : "2K", o = i.split(":");
	if (o.length !== 2) return "2048x2048";
	let s = Number(o[0]), c = Number(o[1]);
	if (!Number.isFinite(s) || !Number.isFinite(c) || s <= 0 || c <= 0) return "2048x2048";
	let l = Math.max(16, Math.round(Math.sqrt(n[a] * s / c) / 16) * 16), u = Math.max(16, Math.round(Math.sqrt(n[a] * c / s) / 16) * 16), d = Math.max(l, u);
	if (d > r) {
		let e = r / d;
		l = Math.max(16, Math.round(l * e / 16) * 16), u = Math.max(16, Math.round(u * e / 16) * 16);
	}
	for (; l * u > 8294400;) l >= u ? l -= 16 : u -= 16, l = Math.max(16, l), u = Math.max(16, u);
	for (; l * u < 655360;) l <= u ? l += 16 : u += 16;
	return `${l}x${u}`;
}
function Ao(e) {
	let t = q(e.url);
	if (t) return {
		kind: "url",
		value: t
	};
	let n = K(e.b64_json) || K(e.base64) || K(e.image_base64);
	if (n) return jo(n);
	let r = Array.isArray(e.data) ? e.data : [];
	for (let e of r) {
		if (!e || typeof e != "object") continue;
		let t = e, n = q(t.url);
		if (n) return {
			kind: "url",
			value: n
		};
		let r = K(t.b64_json) || K(t.base64) || K(t.image_base64);
		if (r) return jo(r);
	}
	return null;
}
function jo(e) {
	let t = e.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
	return t ? {
		kind: "base64",
		value: t[2],
		mimeType: t[1]
	} : {
		kind: "base64",
		value: e
	};
}
async function Mo(e, r, i) {
	if (e.kind === "url") return Wo(e.value, r, i);
	let a = Buffer.from(e.value, "base64"), o = qo(a) || Ko(e.mimeType) || "png", s = n.join(r, `${i}.${o}`);
	return await t.promises.writeFile(s, a), s;
}
function No(e) {
	let t = q(e.url);
	if (t) return t;
	let n = Array.isArray(e.data) ? e.data : [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = q(e.url);
		if (t) return t;
	}
	let r = Array.isArray(e.urls) ? e.urls : [];
	for (let e of r) {
		let t = q(e);
		if (t) return t;
	}
	let i = e.result;
	if (i && typeof i == "object") {
		let e = i, t = q(e.url);
		if (t) return t;
		let n = Array.isArray(e.urls) ? e.urls : [];
		for (let e of n) {
			let t = q(e);
			if (t) return t;
		}
		let r = Array.isArray(e.data) ? e.data : [];
		for (let e of r) {
			if (!e || typeof e != "object") continue;
			let t = q(e.url);
			if (t) return t;
		}
		let a = Array.isArray(e.choices) ? e.choices : [];
		for (let e of a) {
			if (!e || typeof e != "object") continue;
			let t = e.message;
			if (!t || typeof t != "object") continue;
			let n = Po(K(t.content));
			if (n) return n;
		}
		let o = Array.isArray(e.candidates) ? e.candidates : [];
		for (let e of o) {
			let t = Fo(e);
			if (t) return t;
		}
	}
	let a = Po(K(e.content));
	if (a) return a;
	let o = Array.isArray(e.choices) ? e.choices : [];
	for (let e of o) {
		if (!e || typeof e != "object") continue;
		let t = e.message;
		if (!t || typeof t != "object") continue;
		let n = Po(K(t.content));
		if (n) return n;
	}
	let s = Array.isArray(e.candidates) ? e.candidates : [];
	for (let e of s) {
		let t = Fo(e);
		if (t) return t;
	}
	return null;
}
function K(e) {
	return typeof e == "string" && e.trim() ? e.trim() : null;
}
function Po(e) {
	return e?.match(/https?:\/\/[^\s"'<>)]*/u)?.[0] || null;
}
function Fo(e) {
	if (!e || typeof e != "object") return null;
	let t = e.content;
	if (!t || typeof t != "object") return null;
	let n = Array.isArray(t.parts) ? t.parts : [];
	for (let e of n) {
		if (!e || typeof e != "object") continue;
		let t = e, n = Po(K(t.text));
		if (n) return n;
		let r = t.fileData || t.file_data;
		if (r && typeof r == "object") {
			let e = q(r.fileUri) || q(r.file_uri);
			if (e) return e;
		}
	}
	return null;
}
function q(e) {
	let t = K(e);
	return t && /^https?:\/\//i.test(t) ? t : null;
}
function Io(e, t, n) {
	return {
		model: e.model,
		aspect_ratio: e.aspect_ratio,
		image_size: e.image_size,
		size: e.size,
		quality: e.quality,
		output_format: e.output_format,
		extra_body: e.extra_body,
		referenceImageCount: t,
		promptLength: n
	};
}
function Lo(e) {
	return e.trim().startsWith("Bearer ") ? e.trim() : `Bearer ${e.trim()}`;
}
function Ro(e) {
	return encodeURIComponent(e).replaceAll("%2F", "/");
}
function zo(e) {
	let t = String(e || "").trim();
	return t.startsWith("file:") ? fileURLToPath(t) : t;
}
async function Bo(e) {
	let n = String(e || "").trim();
	if (!n) throw Error("Reference image source is empty.");
	if (n.startsWith("data:")) {
		let e = n.match(/^data:(.+?);base64,(.+)$/);
		if (!e) throw Error("Unsupported reference data-url format.");
		return Buffer.from(e[2], "base64");
	}
	if (n.startsWith("http://") || n.startsWith("https://")) {
		let e = await u.fetch(n, { cache: "no-store" });
		if (!e.ok) throw Error(`Failed to fetch reference image (${e.status}).`);
		let t = await e.arrayBuffer();
		return Buffer.from(t);
	}
	let r = zo(n);
	return t.promises.readFile(r);
}
async function Vo(e) {
	return `data:image/jpeg;base64,${(await Uo(e)).toString("base64")}`;
}
async function Ho(e) {
	return {
		mimeType: "image/jpeg",
		data: (await Uo(e)).toString("base64")
	};
}
async function Uo(e) {
	let t = await Bo(e), n = l.createFromBuffer(t);
	if (n.isEmpty()) throw Error("参考图转换为 JPG 失败，请换一张常规 PNG/JPG/WEBP 图片。");
	return n.toJPEG(100);
}
async function Wo(e, r, i) {
	let a = await u.fetch(e);
	if (!a.ok) throw Error(`Failed to download Nano Banana result (${a.status}): ${e}`);
	let o = await a.arrayBuffer(), s = Buffer.from(o), c = qo(s) || Go(e, a.headers.get("content-type")), l = n.join(r, `${i}.${c}`);
	return await t.promises.writeFile(l, s), l;
}
function Go(e, t) {
	let r = Ko(t);
	if (r) return r;
	try {
		let t = new URL(e).pathname, r = n.extname(t).replace(".", "").toLowerCase();
		if (r) return r;
	} catch {}
	return "png";
}
function Ko(e) {
	let t = e?.split(";", 1)[0].trim().toLowerCase();
	return t === "image/png" ? "png" : t === "image/webp" ? "webp" : t === "image/jpeg" || t === "image/jpg" ? "jpg" : t === "image/gif" ? "gif" : t === "image/bmp" ? "bmp" : t === "image/svg+xml" ? "svg" : null;
}
function qo(e) {
	if (e.length >= 4 && e.subarray(0, 4).equals(Buffer.from([
		137,
		80,
		78,
		71
	]))) return "png";
	if (e.length >= 3 && e.subarray(0, 3).equals(Buffer.from([
		255,
		216,
		255
	]))) return "jpg";
	if (e.length >= 12 && e.subarray(0, 4).toString("ascii") === "RIFF" && e.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
	if (e.length >= 6) {
		let t = e.subarray(0, 6).toString("ascii");
		if (t === "GIF87a" || t === "GIF89a") return "gif";
	}
	if (e.length >= 2 && e.subarray(0, 2).toString("ascii") === "BM") return "bmp";
	let t = e.subarray(0, Math.min(e.length, 128)).toString("utf8").trimStart().toLowerCase();
	return t.startsWith("<svg") || t.startsWith("<?xml") ? "svg" : null;
}
function Jo(e) {
	let t = K(e.fail_reason);
	if (t) return t;
	let n = e.error;
	if (typeof n == "string" && n.trim()) return n.trim();
	if (n && typeof n == "object") {
		let e = n, t = K(e.message);
		if (t) return t;
		try {
			return JSON.stringify(e).slice(0, 300);
		} catch {
			return "未知错误";
		}
	}
	return K(e.message) || "未知错误";
}
var Yo = "persist:beibei-direct-network", Xo = null;
async function Zo(e, t, n) {
	if (!n?.enableDirectRetry) return u.fetch(e, t);
	try {
		let n = await u.fetch(e, t);
		if (!Qo(n.status)) return n;
	} catch (e) {
		if (!$o(e)) throw e;
	}
	return await es(), d.fromPartition(Yo).fetch(e, t);
}
function Qo(e) {
	return e >= 500 || e === 407 || e === 429;
}
function $o(e) {
	let t = (e instanceof Error ? e.message : String(e ?? "")).toUpperCase();
	return t.includes("ERR_PROXY_CONNECTION_FAILED") || t.includes("ERR_TUNNEL_CONNECTION_FAILED") || t.includes("ERR_SSL_PROTOCOL_ERROR") || t.includes("ERR_CONNECTION_RESET") || t.includes("ERR_CONNECTION_TIMED_OUT") || t.includes("ERR_TIMED_OUT") || t.includes("ERR_NETWORK_CHANGED");
}
async function es() {
	Xo ||= d.fromPartition(Yo).setProxy({ proxyRules: "direct://" }).catch(() => {}), await Xo;
}
function ts(e) {
	return new Promise((t) => setTimeout(t, e));
}
//#endregion
//#region electron/main.ts
var J = !o.isPackaged && process.env.ELECTRON_FORCE_PROD !== "1", ns = J ? o.getAppPath() : n.dirname(process.execPath), rs = n.join(ns, "temp"), is = n.join(ns, "session-data"), as = n.join(ns, "material-pocket"), Y = rs, X = n.join(rs, "generated"), os = as, ss = n.join(o.getPath("userData"), "debug.log"), cs = [
	"canvas-source-",
	"canvas-mask-",
	"canvas-mask-bridge-",
	"canvas-mask-bridge-input-",
	"canvas-mask-crop-",
	"canvas-mask-edge-repair-",
	"canvas-mask-stitch-",
	"canvas-rmbg-source-",
	"rmbg-output-",
	"bridge-crop-",
	"bridge-output-",
	"bridge-stitcher-"
];
try {
	t.mkdirSync(rs, { recursive: !0 }), t.mkdirSync(is, { recursive: !0 }), t.mkdirSync(as, { recursive: !0 }), o.setPath("temp", rs), o.setPath("sessionData", is), X = n.join(o.getPath("temp"), "generated"), t.mkdirSync(X, { recursive: !0 });
} catch (e) {
	console.warn("[temp] Failed to set dedicated temp/session directories:", e), Y = o.getPath("temp"), X = n.join(Y, "beibei-ai-assistant-generated"), os = n.join(o.getPath("userData"), "material-pocket");
	try {
		t.mkdirSync(X, { recursive: !0 }), t.mkdirSync(os, { recursive: !0 });
	} catch {}
}
var Z = new go({
	dbPath: n.join(o.getPath("userData"), "codex-art-studio.sqlite"),
	defaultOutputDirectory: X
}), ls = r(e), us = "F:\\ComfyUI_windows_portable\\python_embeded\\python.exe", ds = new Set([
	".png",
	".jpg",
	".jpeg",
	".webp",
	".bmp",
	".gif",
	".avif"
]), fs = 96, ps = 32, ms = "8", hs = "F:\\Codex\\model_fp16.onnx", gs = !1, _s = 8 * 1024 * 1024, vs = ["Unable to preventDefault inside passive event listener invocation."];
function ys() {
	return o.isPackaged ? n.join(process.resourcesPath, "assets", "beibei-icon.png") : n.join(o.getAppPath(), "assets", "beibei-icon.png");
}
function Q(e, n) {
	{
		let r = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${e}${n ? ` ${JSON.stringify(n)}` : ""}\n`;
		try {
			t.existsSync(ss) && t.statSync(ss).size > _s && t.writeFileSync(ss, ""), t.appendFile(ss, r, () => {});
		} catch {}
	}
	console.log(e, n ?? "");
}
function bs() {
	let e = o.getPath("temp");
	return e && e.trim() ? e : J ? n.join(o.getAppPath(), "temp") : n.join(n.dirname(process.execPath), "temp");
}
function $() {
	Y = bs(), t.mkdirSync(Y, { recursive: !0 });
}
function xs(e) {
	let t = `${n.resolve(Y).toLowerCase()}${n.sep}`;
	return n.resolve(e).toLowerCase().startsWith(t);
}
function Ss(e) {
	try {
		t.rmSync(e, {
			recursive: !0,
			force: !0
		});
	} catch {}
}
function Cs() {
	let e = n.join(o.getPath("userData"), "temp");
	n.resolve(e).toLowerCase() !== n.resolve(Y).toLowerCase() && Ss(e);
}
function ws() {
	let e = process.env.LOCALAPPDATA;
	if (!e) return;
	let r = n.join(e, "Temp");
	if (!t.existsSync(r) || n.resolve(r).toLowerCase() === n.resolve(Y).toLowerCase()) return;
	let i = [];
	try {
		i = t.readdirSync(r, { withFileTypes: !0 });
	} catch {
		return;
	}
	for (let e of i) {
		if (!e.isFile()) continue;
		let t = e.name.toLowerCase();
		cs.some((e) => t.startsWith(e)) && Ss(n.join(r, e.name));
	}
}
function Ts(e) {
	let r = [], i = [e];
	for (; i.length > 0;) {
		let e = i.pop();
		if (!e) continue;
		let a = t.readdirSync(e, { withFileTypes: !0 });
		for (let t of a) {
			let a = n.join(e, t.name);
			if (t.isDirectory()) {
				i.push(a);
				continue;
			}
			let o = n.extname(t.name).toLowerCase();
			ds.has(o) && r.push(a);
		}
	}
	return r.sort((e, t) => e.localeCompare(t, "zh-CN")), r;
}
function Es() {
	t.mkdirSync(os, { recursive: !0 });
}
function Ds(e) {
	let t = String(e || "").toLowerCase();
	return t.includes("jpeg") || t.includes("jpg") ? "jpg" : t.includes("webp") ? "webp" : t.includes("gif") ? "gif" : t.includes("bmp") ? "bmp" : t.includes("svg") ? "svg" : t.includes("avif") ? "avif" : "png";
}
function Os(e) {
	let t = e.split("?")[0], r = n.extname(t).replace(".", "").toLowerCase();
	return r && [
		"jpg",
		"jpeg",
		"png",
		"webp",
		"gif",
		"bmp",
		"svg",
		"avif"
	].includes(r) ? r === "jpeg" ? "jpg" : r : "png";
}
function ks(e) {
	return String(e || "").trim().replace(/\.[a-zA-Z0-9]{1,8}$/, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").replace(/\s+/g, "-").slice(0, 80).trim() || `material-${Date.now()}`;
}
async function As(e) {
	let n = String(e || "").trim();
	if (!n) throw Error("Invalid material source.");
	if (n.startsWith("data:")) {
		let e = n.match(/^data:(.+?);base64,(.+)$/);
		if (!e) throw Error("Unsupported data-url image payload.");
		let t = e[1], r = e[2];
		return {
			buffer: Buffer.from(r, "base64"),
			extension: Ds(t)
		};
	}
	if (n.startsWith("http://") || n.startsWith("https://")) {
		let e = await u.fetch(n);
		if (!e.ok) throw Error(`Failed to fetch image source (${e.status}).`);
		let t = e.headers.get("content-type") || "", r = await e.arrayBuffer();
		return {
			buffer: Buffer.from(r),
			extension: Ds(t) || Os(n)
		};
	}
	let r = n.startsWith("file:") ? fileURLToPath(n) : n;
	if (!t.existsSync(r)) throw Error(`Source image not found: ${r}`);
	return {
		buffer: t.readFileSync(r),
		extension: Os(r)
	};
}
function js(e) {
	let t = Number.isFinite(e) ? Number(e) : 95;
	return Math.max(1, Math.min(100, Math.round(t)));
}
function Ms(e, t) {
	let n = l.createFromBuffer(e);
	if (n.isEmpty()) {
		let t = `data:image/png;base64,${e.toString("base64")}`;
		n = l.createFromDataURL(t);
	}
	if (n.isEmpty()) throw Error("Unable to decode source image for JPEG conversion.");
	return n.toJPEG(js(t));
}
function Ns() {
	return o.isPackaged ? n.join(process.resourcesPath, "bridge", "comfy_mask_bridge.py") : n.join(o.getAppPath(), "scripts", "comfy_mask_bridge.py");
}
function Ps() {
	return o.isPackaged ? n.join(process.resourcesPath, "bridge", "rmbg_onnx_bridge.py") : n.join(o.getAppPath(), "scripts", "rmbg_onnx_bridge.py");
}
function Fs() {
	return o.isPackaged ? n.join(process.resourcesPath, "bridge", "inpaint_cropandstitch.py") : n.join(o.getAppPath(), "scripts", "inpaint_cropandstitch.py");
}
function Is() {
	let e = process.platform === "win32" ? n.join("bridge-runtime", "python", "python.exe") : process.platform === "darwin" && process.arch === "arm64" ? n.join("bridge-runtime", "darwin-arm64", "python", "bin", "python3") : process.platform === "darwin" && process.arch === "x64" ? n.join("bridge-runtime", "darwin-x64", "python", "bin", "python3") : n.join("bridge-runtime", `${process.platform}-${process.arch}`, "python", "bin", "python3");
	return o.isPackaged ? n.join(process.resourcesPath, e) : n.join(o.getAppPath(), "resources", e);
}
function Ls() {
	return o.isPackaged ? n.join(process.resourcesPath, "models", "model_fp16.onnx") : n.join(o.getAppPath(), "models", "model_fp16.onnx");
}
function Rs() {
	let e = [
		Is(),
		o.isPackaged ? null : process.env.BEIBEI_BRIDGE_PYTHON,
		o.isPackaged ? null : process.platform === "win32" ? us : "python3"
	].filter(Boolean);
	for (let n of e) if (n === "python3" || t.existsSync(n)) return n;
	throw Error(`Bridge Python runtime not found for ${process.platform}/${process.arch}. Expected packaged runtime under resources/${process.platform === "darwin" && process.arch === "arm64" ? "bridge-runtime/darwin-arm64/python/bin/python3" : process.platform === "darwin" && process.arch === "x64" ? "bridge-runtime/darwin-x64/python/bin/python3" : "bridge-runtime/python/python.exe"}. Tried: ${e.join(", ")}`);
}
async function zs(e, n) {
	let r = Rs(), i = Ns(), a = Fs();
	if (!t.existsSync(i)) throw Error(`Mask bridge script not found: ${i}`);
	if (!t.existsSync(a)) throw Error(`Mask bridge plugin not found: ${a}`);
	Q("mask-bridge:start", {
		command: e,
		pythonPath: r,
		scriptPath: i,
		pluginPath: a,
		args: n
	});
	let { stdout: o, stderr: s } = await ls(r, [
		"-s",
		i,
		e,
		...n
	], {
		windowsHide: !0,
		maxBuffer: 16 * 1024 * 1024,
		env: {
			...process.env,
			COMFY_PLUGIN_PATH: a
		}
	});
	s?.trim() && Q("mask-bridge:stderr", {
		command: e,
		stderr: s.trim()
	});
	let c = o.split(/\r?\n/).map((e) => e.trim()).filter(Boolean).at(-1);
	if (!c) throw Error(`Mask bridge returned no output for ${e}.`);
	try {
		let t = JSON.parse(c);
		return Q("mask-bridge:done", {
			command: e,
			parsed: t
		}), t;
	} catch {
		throw Error(`Mask bridge returned invalid JSON for ${e}: ${c}`);
	}
}
function Bs(e) {
	let n = [
		e,
		process.env.BEIBEI_RMBG_MODEL_PATH,
		Ls(),
		hs
	].map((e) => String(e || "").trim()).filter(Boolean);
	for (let e of n) if (t.existsSync(e)) return e;
	throw Error(`RMBG model not found. Tried: ${n.join(", ")}`);
}
async function Vs(e) {
	let n = Rs(), r = Ps(), i = Bs(e.modelPath);
	if (!t.existsSync(r)) throw Error(`RMBG bridge script not found: ${r}`);
	Q("rmbg-bridge:start", {
		pythonPath: n,
		scriptPath: r,
		modelPath: i,
		imagePath: e.imagePath,
		outputPath: e.outputPath
	});
	let { stdout: a, stderr: o } = await ls(n, [
		"-s",
		r,
		"--image",
		e.imagePath,
		"--output",
		e.outputPath,
		"--model",
		i
	], {
		windowsHide: !0,
		maxBuffer: 16 * 1024 * 1024,
		env: { ...process.env }
	});
	o?.trim() && Q("rmbg-bridge:stderr", { stderr: o.trim() });
	let s = a.split(/\r?\n/).map((e) => e.trim()).filter(Boolean).at(-1);
	if (!s) throw Error("RMBG bridge returned no output.");
	try {
		let e = JSON.parse(s);
		return Q("rmbg-bridge:done", { parsed: e }), e;
	} catch {
		throw Error(`RMBG bridge returned invalid JSON: ${s}`);
	}
}
function Hs() {
	Q("createWindow:start", { isDev: J });
	let e = new i({
		width: 1480,
		height: 960,
		minWidth: 1180,
		minHeight: 760,
		backgroundColor: "#f5f7fb",
		title: "Kr ai",
		autoHideMenuBar: !0,
		icon: ys(),
		webPreferences: {
			preload: n.join(import.meta.dirname, "preload.mjs"),
			contextIsolation: !0,
			nodeIntegration: !1
		}
	});
	if (e.setMenuBarVisibility(!1), e.webContents.setZoomFactor(1), e.webContents.setVisualZoomLevelLimits(1, 1), e.webContents.on("before-input-event", (t, n) => {
		let r = n.key.toLowerCase(), i = n.control && (r === "+" || r === "-" || r === "=" || r === "0"), a = n.type === "mouseWheel" && n.control;
		(i || a) && (t.preventDefault(), e.webContents.setZoomFactor(1));
	}), J) e.loadURL("http://localhost:5173");
	else {
		let t = n.join(import.meta.dirname, "../dist/index.html");
		Q("createWindow:loadFile", { target: t }), e.loadFile(t);
	}
	e.webContents.on("did-fail-load", (e, t, n, r) => {
		Q("renderer:did-fail-load", {
			code: t,
			description: n,
			url: r
		});
	}), e.webContents.on("console-message", (e, t, n, r, i) => {
		vs.some((e) => n.includes(e)) || Q("renderer:console", {
			level: t,
			message: n,
			line: r,
			sourceId: i
		});
	}), e.webContents.on("render-process-gone", (e, t) => {
		Q("renderer:gone", t);
	}), e.webContents.on("did-finish-load", () => {
		e.webContents.setZoomFactor(1), Q("renderer:did-finish-load"), J && process.env.BEIBEI_DEBUG_SNAPSHOT === "1" && (Us(e, "immediate"), setTimeout(() => Us(e, "after-1s"), 1e3), setTimeout(() => Us(e, "after-3s"), 3e3));
	});
	let t = !1;
	e.on("close", async (n) => {
		gs || t || (n.preventDefault(), (await s.showMessageBox(e, {
			type: "question",
			buttons: ["取消", "退出"],
			defaultId: 0,
			cancelId: 0,
			title: "退出确认",
			message: "确定要关闭 Kr ai 吗？",
			detail: "关闭后当前软件会退出，后台任务也会停止。",
			noLink: !0
		})).response === 1 && (t = !0, gs = !0, e.close()));
	});
}
function Us(e, t) {
	e.webContents.executeJavaScript(`
      ({
        label: ${JSON.stringify(t)},
        title: document.title,
        rootExists: Boolean(document.getElementById('root')),
        rootHtmlLength: document.getElementById('root')?.innerHTML.length ?? -1,
        rootText: document.getElementById('root')?.innerText?.slice(0, 200) ?? '',
        bodyTextLength: document.body?.innerText?.length ?? -1,
        bodyText: document.body?.innerText?.slice(0, 200) ?? '',
        scriptCount: document.scripts.length,
        stylesheetCount: document.styleSheets.length
      })
    `).then((e) => Q("renderer:dom-snapshot", e)).catch((e) => {
		Q("renderer:dom-snapshot-error", e instanceof Error ? {
			label: t,
			message: e.message
		} : {
			label: t,
			error: e
		});
	});
}
o.whenReady().then(() => {
	Q("app:ready"), o.setName("Kr ai"), a.setApplicationMenu(null), $(), Q("temp:directory", { tempDirectory: Y }), c.handle("bootstrap", () => {
		Q("ipc:bootstrap:start");
		let e = Z.bootstrap();
		return Q("ipc:bootstrap:done", {
			providers: e.providers.length,
			presets: e.presets.length,
			jobs: e.jobs.length
		}), e;
	}), c.handle("provider:save", (e, t) => (Q("ipc:provider:save"), Z.saveProvider(t))), c.handle("settings:save", (e, t) => (Q("ipc:settings:save"), Z.saveSettings(t))), c.handle("preset-theme:save", (e, t) => (Q("ipc:preset-theme:save"), Z.savePresetTheme(t))), c.handle("preset-theme:delete", (e, t) => (Q("ipc:preset-theme:delete", { id: t }), Z.deletePresetTheme(t))), c.handle("preset:save", (e, t) => (Q("ipc:preset:save"), Z.savePreset(t))), c.handle("preset:delete", (e, t) => (Q("ipc:preset:delete", { id: t }), Z.deletePreset(t))), c.handle("workspace:saveState", (e, t) => (Q("ipc:workspace:saveState"), Z.saveWorkspaceState(t))), c.handle("generation:create", (e, t) => (Q("ipc:generation:create"), Z.generateArtwork(t))), c.handle("history:saveJob", (e, t) => (Q("ipc:history:saveJob"), Z.saveHistoryJob(t))), c.handle("history:deleteJob", (e, t) => (Q("ipc:history:deleteJob"), Z.deleteHistoryJob(t))), c.handle("filesystem:pickReferenceImage", async () => {
		let e = await s.showOpenDialog({
			title: "选择参考图",
			filters: [{
				name: "Images",
				extensions: [
					"png",
					"jpg",
					"jpeg",
					"webp"
				]
			}],
			properties: ["openFile", "multiSelections"]
		});
		return e.canceled || e.filePaths.length === 0 ? [] : e.filePaths.map((e) => ({
			path: e,
			url: p(e).toString()
		}));
	}), c.handle("filesystem:pickImageFolder", async () => {
		let e = await s.showOpenDialog({
			title: "选择图片文件夹",
			properties: ["openDirectory"]
		});
		if (e.canceled || e.filePaths.length === 0) return null;
		let t = e.filePaths[0], r = Ts(t);
		return r.length === 0 ? {
			path: t,
			name: n.basename(t),
			images: []
		} : {
			path: t,
			name: n.basename(t),
			images: r.map((e) => ({
				path: e,
				url: p(e).toString()
			}))
		};
	}), c.handle("filesystem:pickOutputDirectory", async () => {
		let e = await s.showOpenDialog({
			title: "选择输出目录",
			properties: ["openDirectory", "createDirectory"]
		});
		return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0];
	}), c.handle("filesystem:saveImageAs", async (e, r) => {
		if (!r || !t.existsSync(r)) return null;
		let i = await s.showSaveDialog({
			title: "另存为",
			defaultPath: n.join(o.getPath("pictures"), n.basename(r)),
			filters: [{
				name: "Images",
				extensions: [
					"png",
					"jpg",
					"jpeg",
					"webp",
					"svg"
				]
			}]
		});
		return i.canceled || !i.filePath ? null : (t.copyFileSync(r, i.filePath), i.filePath);
	}), c.handle("filesystem:saveTempImageData", async (e, r) => {
		let { dataUrl: i, fileName: a } = r ?? {};
		if (!i || typeof i != "string" || !i.startsWith("data:")) throw Error("Invalid temporary image payload.");
		let o = i.match(/^data:(.+?);base64,(.+)$/);
		if (!o) throw Error("Unsupported temporary image format.");
		let s = o[1], c = o[2], l = s.includes("jpeg") ? "jpg" : s.includes("webp") ? "webp" : "png";
		$();
		let u = (a || `temp-${Date.now()}`).replace(/[<>:"/\\|?*]+/g, "-"), d = n.join(Y, `${u}.${l}`);
		return t.writeFileSync(d, Buffer.from(c, "base64")), {
			path: d,
			url: p(d).toString()
		};
	}), c.handle("filesystem:normalizeImageToJpeg", async (e, r) => {
		let i = String(r?.source ?? "").trim();
		if (!i) throw Error("Invalid image source for JPEG normalization.");
		$();
		let a = (r?.fileName || `canvas-source-${Date.now()}`).replace(/\.[a-zA-Z0-9]{1,8}$/g, "").replace(/[<>:"/\\|?*]+/g, "-"), o = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, s = n.join(Y, `${a}-${o}.jpg`), { buffer: c } = await As(i), l = Ms(c, r?.qualityPercent);
		return t.writeFileSync(s, l), {
			path: s,
			url: p(s).toString()
		};
	}), c.handle("filesystem:saveImageToMaterialPocket", async (e, r) => {
		let i = String(r?.source ?? "").trim();
		if (!i) throw Error("Invalid material pocket source.");
		let a = ks(r?.fileName);
		Es();
		let { buffer: o, extension: s } = await As(i), c = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, l = n.join(os, `${a}-${c}.${s}`);
		return t.writeFileSync(l, o), {
			path: l,
			url: p(l).toString()
		};
	}), c.handle("filesystem:readImageDataUrl", async (e, r) => {
		if (!r || typeof r != "string") throw Error("Invalid image source.");
		if (r.startsWith("data:")) return r;
		let i = "image/png", a;
		if (r.startsWith("http://") || r.startsWith("https://")) {
			let e = await u.fetch(r);
			if (!e.ok) throw Error(`Failed to fetch remote image (${e.status}).`);
			let t = await e.arrayBuffer();
			a = Buffer.from(t);
			let n = e.headers.get("content-type")?.toLowerCase() ?? "";
			n.includes("jpeg") ? i = "image/jpeg" : n.includes("webp") ? i = "image/webp" : n.includes("svg") ? i = "image/svg+xml" : n.includes("png") && (i = "image/png");
		} else {
			let e = r.startsWith("file:") ? fileURLToPath(r) : r;
			a = t.readFileSync(e);
			let o = n.extname(e).toLowerCase();
			i = o === ".jpg" || o === ".jpeg" ? "image/jpeg" : o === ".webp" ? "image/webp" : o === ".svg" ? "image/svg+xml" : "image/png";
		}
		return `data:${i};base64,${a.toString("base64")}`;
	}), c.handle("mask-bridge:crop", async (e, t) => {
		$();
		let r = n.join(Y, `bridge-crop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`), i = n.join(Y, `bridge-stitcher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pt`), a = await zs("crop", [
			"--image",
			t.imagePath,
			"--mask",
			t.maskPath,
			"--target-width",
			String(t.targetWidth),
			"--target-height",
			String(t.targetHeight),
			"--mask-expand-pixels",
			String(fs),
			"--mask-blend-pixels",
			String(ps),
			"--output-padding",
			ms,
			"--crop-out",
			r,
			"--stitcher-out",
			i
		]), o = String(a.crop_path), s = String(a.stitcher_path);
		return t.maskPath && xs(t.maskPath) && Ss(t.maskPath), {
			crop: {
				path: o,
				url: p(o).toString()
			},
			stitcherPath: s
		};
	}), c.handle("mask-bridge:stitch", async (e, t) => {
		$();
		let r = n.join(Y, `bridge-output-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`), i = [
			"--stitcher",
			t.stitcherPath,
			"--image",
			t.imagePath,
			"--output",
			r
		];
		t.originalPath && i.push("--original", t.originalPath), t.maskPath && i.push("--mask", t.maskPath);
		let a = await zs("stitch", i), o = String(a.output_path);
		return {
			path: o,
			url: p(o).toString()
		};
	}), c.handle("rmbg:remove-background", async (e, t) => {
		$();
		let r = n.join(Y, `rmbg-output-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`), i = await Vs({
			imagePath: String(t?.imagePath || ""),
			outputPath: r,
			modelPath: t?.modelPath
		}), a = String(i.output_path || r);
		return {
			path: a,
			url: p(a).toString()
		};
	}), c.handle("system:openExternalUrl", async (e, t) => {
		let n = String(t || "").trim();
		n && await f.openExternal(n);
	}), Hs(), setTimeout(() => {
		try {
			Cs(), ws(), Q("temp:legacy-cleanup:done");
		} catch (e) {
			Q("temp:legacy-cleanup:error", e instanceof Error ? { message: e.message } : e);
		}
	}, 1500), o.on("activate", () => {
		i.getAllWindows().length === 0 && Hs();
	});
}), o.on("window-all-closed", () => {
	process.platform !== "darwin" && o.quit();
}), o.on("before-quit", () => {
	gs = !0;
});
//#endregion

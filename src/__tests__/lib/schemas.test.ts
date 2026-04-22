import { describe, it, expect } from "vitest"
import { registerSchema, loginSchema, passwordStrength } from "@/lib/schemas"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const VALID_REGISTER = {
  firstName:         "Jean",
  lastName:          "Dupont",
  email:             "jean@exemple.com",
  professionalTitle: "Développeur",
  password:          "Secure123",
  confirmPassword:   "Secure123",
  acceptTerms:       true,
}

function parseRegister(overrides: object) {
  return registerSchema.safeParse({ ...VALID_REGISTER, ...overrides })
}

function parseLogin(overrides: object) {
  return loginSchema.safeParse({ email: "test@test.com", password: "pass", ...overrides })
}

function firstError(result: ReturnType<typeof parseRegister>, field: string) {
  if (result.success) return undefined
  return result.error.flatten().fieldErrors[field as keyof typeof result.error.flatten().fieldErrors]?.[0]
}

// ─── Register schema ──────────────────────────────────────────────────────────

describe("registerSchema", () => {
  it("parses a valid form", () => {
    const result = registerSchema.safeParse(VALID_REGISTER)
    expect(result.success).toBe(true)
  })

  describe("firstName", () => {
    it("rejects empty", () => {
      expect(parseRegister({ firstName: "" }).success).toBe(false)
    })
    it("rejects single character", () => {
      expect(parseRegister({ firstName: "A" }).success).toBe(false)
    })
    it("rejects more than 50 chars", () => {
      expect(parseRegister({ firstName: "A".repeat(51) }).success).toBe(false)
    })
    it("accepts valid name", () => {
      expect(parseRegister({ firstName: "Marie" }).success).toBe(true)
    })
  })

  describe("lastName", () => {
    it("rejects empty", () => {
      expect(parseRegister({ lastName: "" }).success).toBe(false)
    })
    it("accepts valid name", () => {
      expect(parseRegister({ lastName: "Martin" }).success).toBe(true)
    })
  })

  describe("email", () => {
    it("rejects empty", () => {
      const r = parseRegister({ email: "" })
      expect(r.success).toBe(false)
      expect(firstError(r, "email")).toContain("requis")
    })
    it.each(["notanemail", "missing@", "@nodomain.com", "no space@test.com"])(
      "rejects invalid email: %s",
      (email) => expect(parseRegister({ email }).success).toBe(false),
    )
    it("accepts valid email", () => {
      expect(parseRegister({ email: "user@domain.fr" }).success).toBe(true)
    })
  })

  describe("professionalTitle", () => {
    it("is optional — empty string is valid", () => {
      expect(parseRegister({ professionalTitle: "" }).success).toBe(true)
    })
    it("is optional — undefined is valid", () => {
      const { professionalTitle: _, ...rest } = VALID_REGISTER
      expect(registerSchema.safeParse(rest).success).toBe(true)
    })
    it("rejects more than 100 chars", () => {
      expect(parseRegister({ professionalTitle: "A".repeat(101) }).success).toBe(false)
    })
  })

  describe("password", () => {
    it("rejects empty", () => {
      expect(parseRegister({ password: "", confirmPassword: "" }).success).toBe(false)
    })
    it("rejects fewer than 8 characters", () => {
      expect(parseRegister({ password: "Ab1", confirmPassword: "Ab1" }).success).toBe(false)
    })
    it("rejects missing uppercase", () => {
      expect(parseRegister({ password: "nouppercase1", confirmPassword: "nouppercase1" }).success).toBe(false)
    })
    it("rejects missing digit", () => {
      expect(parseRegister({ password: "NoDigitHere", confirmPassword: "NoDigitHere" }).success).toBe(false)
    })
    it("accepts strong password", () => {
      expect(parseRegister({ password: "StrongPass1!", confirmPassword: "StrongPass1!" }).success).toBe(true)
    })
  })

  describe("confirmPassword", () => {
    it("rejects mismatched passwords", () => {
      const r = parseRegister({ confirmPassword: "Different1" })
      expect(r.success).toBe(false)
      const err = r.success ? null : r.error.flatten().fieldErrors.confirmPassword?.[0]
      expect(err).toContain("correspondent pas")
    })
    it("accepts matching passwords", () => {
      expect(parseRegister({ password: "Secure123", confirmPassword: "Secure123" }).success).toBe(true)
    })
  })

  describe("acceptTerms", () => {
    it("rejects false", () => {
      expect(parseRegister({ acceptTerms: false }).success).toBe(false)
    })
    it("accepts true", () => {
      expect(parseRegister({ acceptTerms: true }).success).toBe(true)
    })
  })
})

// ─── Login schema ─────────────────────────────────────────────────────────────

describe("loginSchema", () => {
  it("parses valid credentials", () => {
    expect(loginSchema.safeParse({ email: "test@test.com", password: "anypass" }).success).toBe(true)
  })
  it("rejects empty email", () => {
    expect(parseLogin({ email: "" }).success).toBe(false)
  })
  it("rejects invalid email", () => {
    expect(parseLogin({ email: "notanemail" }).success).toBe(false)
  })
  it("rejects empty password", () => {
    expect(parseLogin({ password: "" }).success).toBe(false)
  })
})

// ─── passwordStrength ─────────────────────────────────────────────────────────

describe("passwordStrength", () => {
  it("returns 0 for empty string", () => {
    expect(passwordStrength("")).toBe(0)
  })
  it("returns 1 for weak (only length)", () => {
    expect(passwordStrength("abcdefgh")).toBe(1)
  })
  it("returns 2 for medium (length + upper + digit)", () => {
    expect(passwordStrength("Abcdefg1")).toBe(2)
  })
  it("returns 3 for strong (length + upper + digit + special)", () => {
    expect(passwordStrength("Abcdef1!")).toBe(3)
  })
})

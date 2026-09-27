package service

import "testing"

func TestNormalizeAnswerKey(t *testing.T) {
	cases := map[string]string{
		"SETUJU":       "SETUJU",
		"TIDAK SETUJU": "TIDAK_SETUJU",
		"TIDAK_SETUJU": "TIDAK_SETUJU",
		"tidak tepat":  "TIDAK_TEPAT",
		" Benar ":      "BENAR",
	}
	for in, want := range cases {
		if got := normalizeAnswerKey(in); got != want {
			t.Errorf("normalizeAnswerKey(%q) = %q, want %q", in, got, want)
		}
	}
}

func TestKunciMarkerRegex(t *testing.T) {
	cases := map[string]string{
		"adsasd [KUNCI: SETUJU]":       "SETUJU",
		"asdasd [KUNCI: TIDAK SETUJU]": "TIDAK SETUJU",
		"x [kunci: benar]":             "benar",
		"plain option":                 "",
	}
	for in, want := range cases {
		m := kunciMarkerRegex.FindStringSubmatch(in)
		got := ""
		if len(m) >= 2 {
			got = m[1]
		}
		if got != want {
			t.Errorf("kunciMarkerRegex(%q) = %q, want %q", in, got, want)
		}
		if want != "" && normalizeAnswerKey(got) == "" {
			t.Errorf("normalizeAnswerKey(%q) is empty", got)
		}
	}
}

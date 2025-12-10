autowatch = 1

var { defs } = require('srm-bl002-defs.js')

var _cfg = null
var _selected_notes = []
var _note_probabilities = []
var _notes = []

var _preset_patterns = [
    {
        name: "offbeat",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 2, d: defs.NOTE8 },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 10, d: defs.NOTE8 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "straight-8",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8 },
            { s: defs.NOTE16 * 2, d: defs.NOTE8 },
            { s: defs.NOTE16 * 4, d: defs.NOTE8 },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 8, d: defs.NOTE8 },
            { s: defs.NOTE16 * 10, d: defs.NOTE8 },
            { s: defs.NOTE16 * 12, d: defs.NOTE8 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "straight-16",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE16 },
            { s: defs.NOTE16 * 1, d: defs.NOTE16 },
            { s: defs.NOTE16 * 2, d: defs.NOTE16 },
            { s: defs.NOTE16 * 3, d: defs.NOTE16 },
            { s: defs.NOTE16 * 4, d: defs.NOTE16 },
            { s: defs.NOTE16 * 5, d: defs.NOTE16 },
            { s: defs.NOTE16 * 6, d: defs.NOTE16 },
            { s: defs.NOTE16 * 7, d: defs.NOTE16 },
            { s: defs.NOTE16 * 8, d: defs.NOTE16 },
            { s: defs.NOTE16 * 9, d: defs.NOTE16 },
            { s: defs.NOTE16 * 10, d: defs.NOTE16 },
            { s: defs.NOTE16 * 11, d: defs.NOTE16 },
            { s: defs.NOTE16 * 12, d: defs.NOTE16 },
            { s: defs.NOTE16 * 13, d: defs.NOTE16 },
            { s: defs.NOTE16 * 14, d: defs.NOTE16 },
            { s: defs.NOTE16 * 15, d: defs.NOTE16 },
        ]
    },
    {
        name: "groover (a)",
        duration: 4,
        notes: [
            { s: 0, d: defs.NOTE16 },
            { s: defs.NOTE16 * 3, d: defs.NOTE8 },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 9, d: defs.NOTE16 },
            { s: defs.NOTE16 * 11, d: defs.NOTE8 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "groover (b)",
        duration: 4,
        notes: [
            { s: 0, d: defs.NOTE16 },
            { s: defs.NOTE16 * 3, d: defs.NOTE8 },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 10, d: defs.NOTE16 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "better",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 1, d: defs.NOTE16 },
            { s: defs.NOTE16 * 3, d: defs.NOTE16 },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 9, d: defs.NOTE16 },
            { s: defs.NOTE16 * 11, d: defs.NOTE16 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "workhorse",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 2, d: defs.NOTE16 },
            { s: defs.NOTE16 * 5, d: defs.NOTE16 },
            { s: defs.NOTE16 * 7, d: defs.NOTE16 },
            { s: defs.NOTE16 * 9, d: defs.NOTE16 },
            { s: defs.NOTE16 * 12, d: defs.NOTE16 },
            { s: defs.NOTE16 * 13, d: defs.NOTE16 },
        ]
    },
    {
        name: "root-rhythm",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 2, d: defs.NOTE16 },
            { s: defs.NOTE16 * 5, d: defs.NOTE16 },
            { s: defs.NOTE16 * 8, d: defs.NOTE16 },
            { s: defs.NOTE16 * 10, d: defs.NOTE16 },
            { s: defs.NOTE16 * 14, d: defs.NOTE16 },
        ]
    },
    {
        name: "bass-lead",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE8d },
            { s: defs.NOTE16 * 9, d: defs.NOTE8d },
            { s: defs.NOTE16 * 12, d: defs.NOTE8 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "shuffle",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 2, d: defs.NOTE8 },
            { s: defs.NOTE16 * 7, d: defs.NOTE8 },
            { s: defs.NOTE16 * 9, d: defs.NOTE8 },
            { s: defs.NOTE16 * 14, d: defs.NOTE8 },
        ]
    },
    {
        name: "dotted-eighth-1",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE8d },
            { s: defs.NOTE16 * 9, d: defs.NOTE8d },
            { s: defs.NOTE16 * 12, d: defs.NOTE4 },
        ]
    },
    {
        name: "dotted-eighth-2",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE8d },
            { s: defs.NOTE16 * 9, d: defs.NOTE4 },
            { s: defs.NOTE16 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-3",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE4 },
            { s: defs.NOTE16 * 10, d: defs.NOTE8d },
            { s: defs.NOTE16 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-4",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE4 },
            { s: defs.NOTE16 * 7, d: defs.NOTE8d },
            { s: defs.NOTE16 * 10, d: defs.NOTE8d },
            { s: defs.NOTE16 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-5",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE4 },
            { s: defs.NOTE16 * 4, d: defs.NOTE8d },
            { s: defs.NOTE16 * 7, d: defs.NOTE8d },
            { s: defs.NOTE16 * 10, d: defs.NOTE8d },
            { s: defs.NOTE16 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-6",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE8 },
            { s: defs.NOTE16 * 8, d: defs.NOTE8d },
            { s: defs.NOTE16 * 11, d: defs.NOTE8d },
            { s: defs.NOTE14 * 11, d: defs.NOTE8 },
        ]
    },
    {
        name: "dotted-eighth-7",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8 },
            { s: defs.NOTE16 * 5, d: defs.NOTE8d },
            { s: defs.NOTE16 * 8, d: defs.NOTE8d },
            { s: defs.NOTE16 * 11, d: defs.NOTE8 },
            { s: defs.NOTE14 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-8",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8 },
            { s: defs.NOTE16 * 2, d: defs.NOTE8d },
            { s: defs.NOTE16 * 5, d: defs.NOTE8d },
            { s: defs.NOTE16 * 8, d: defs.NOTE8 },
            { s: defs.NOTE16 * 10, d: defs.NOTE8d },
            { s: defs.NOTE14 * 13, d: defs.NOTE8d },
        ]
    },
    {
        name: "dotted-eighth-9",
        duration: 4,
        notes: [
            { s: defs.NOTE16 * 0, d: defs.NOTE8d },
            { s: defs.NOTE16 * 3, d: defs.NOTE8d },
            { s: defs.NOTE16 * 6, d: defs.NOTE8d },
            { s: defs.NOTE16 * 9, d: defs.NOTE8d },
            { s: defs.NOTE16 * 12, d: defs.NOTE8d },
            { s: defs.NOTE16 * 15, d: defs.NOTE16 },
        ]
    }
]

// get value from 0 to max - 1
function get_random_int (max) {
    return Math.floor(Math.random() * max);
}

function is_bouncy(t) {
    var decimal = t - Math.floor(t)
    decimal.toFixed(2)
    if (decimal == 0 || decimal == 0.5) {
        return false
    }
    return true
}

function concat_patterns (patterns) {
    var pattern = {
        duration: 0,
        notes: []
    }

    var offset = 0
    //post("[concat_patterns] concatenating " + patterns.length + " patterns...\n")
    for(var i = 0; i < patterns.length; i++) {
        //post("[concat_patterns] pattern " + i + "; " + patterns[i].notes.length + "notes...\n")
        for(var j = 0; j < patterns[i].notes.length; j++) {
            var norig = patterns[i].notes[j]
            var n = {}
            for (var property in norig) {
                n[property] = norig[property]
            }
            //var n = Object.assign({}, patterns[i].notes[j])
            n.s += offset 
            pattern.notes.push(n)
        }
        offset += patterns[i].duration
    }

    pattern.duration = offset

    return pattern
}

function select_preset_pattern() {
    var r = get_random_int(_preset_patterns.length) 
    pattern = _preset_patterns[r]

    post("[select_preset_pattern] selected " + pattern.name + "\n")

    for (var i = 0; i < pattern.notes.length; i++) {
        pattern.notes[i].v = 127
        pattern.notes[i].p = select_random_pitch()
    }

    return pattern
}

function get_num_notes_to_modify(pattern) {
    var r = get_random_int(100)
    var num_notes = 3
    if (r < 75) {
        num_notes = 1
    }
    else if (r < 95) {
        num_notes = 2
    }

    return num_notes
}

function variation_add(pattern, occupied16ths) {
    var occupied16ths = []
    var i = 0
    for (var t = 0; t < pattern.duration; t += defs.NOTE16) {
        occupied16ths[i] = 0
        i++
    }

    var new_notes = []
    for (var i = 0; i < pattern.notes.length; i++) {
        next_note_start = 0
        if (i == pattern.notes.length - 1) {
            next_note_start = pattern.duration
        } else {
            next_note_start = pattern.notes[i + 1].s
        }

        new_notes.push(pattern.notes[i])

        if (next_note_start == pattern.notes[i].s + pattern.notes[i].d) {
            continue
        }

        var gap_size = next_note_start - (pattern.notes[i].s + pattern.notes[i].d)

        // otherwise, we have a gap
        r = get_random_int(100)
        if (r > _cfg.variability['add']) {
            post("[variation_add] found gap of " + gap_size + " after note " + i + "; skipping\n")
            continue
        }

        post("[variation_add] found gap of " + gap_size + " after note " + i + "; adding note\n")
        var d = defs.NOTE16
        if (gap_size >= defs.NOTE8d) {
            d = [defs.NOTE16, defs.NOTE8, defs.NOTE8d][get_random_int(3)]
        }
        else if (gap_size == defs.NOTE8) {
            d = [defs.NOTE16, defs.NOTE8][get_random_int(2)]
        }
        new_notes.push({
            s: pattern.notes[i].s + pattern.notes[i].d,
            d: d,
            v: 127,
            p: select_random_pitch()
        })
    }
    pattern.notes = new_notes
    return pattern
}

function variation_delete(pattern) {
    var new_notes = []
    for (var i = 0; i < pattern.notes.length; i++) {
        var r = get_random_int(100)
        if (r < _cfg.variability["delete"]) {
            post("[variation_delete]  - deleting note at idx " + i + "\n")
        }
        else {
            new_notes.push(pattern.notes[i])
        }
    }

    pattern.notes = new_notes
    return pattern
}

function variation_pitch(pattern) {
    if (pattern.notes.length == 0) {
        post("[variation_pitch] no notes in pattern; nothing to change\n")
        return pattern
    }

    for (var i = 0; i < pattern.notes.length; i++) {
        var r = get_random_int(100)
        if (r < _cfg.variability["pitch"]) {
            post("[variation_pitch]  - changing note at idx " + i + "\n")
            pattern.notes[i].p = select_random_pitch()
        }
    }

    return pattern
}

function split_note(note) {
    if (note.d == defs.NOTE8) {
        var note1 = {
            "s": note.s,
            "v": note.v,
            "p": note.p,
            "d": defs.NOTE16
        }
        var note2 = {
            "s": note.s + defs.NOTE16,
            "v": note.v,
            "p": note.p,
            "d": defs.NOTE16
        }
        return [note1, note2]
    }

    if (note.d == defs.NOTE8d) {
        var r = get_random_int(2)
        if (r == 0) {
            var note1 = {
                "s": note.s,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE16
            }
            var note2 = {
                "s": note.s + defs.NOTE16,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8
            }
            return [note1, note2]
        }
        else {
            var note1 = {
                "s": note.s,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8
            }
            var note2 = {
                "s": note.s + defs.NOTE8,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE16
            }
            return [note1, note2]
        }
    }

    if (note.d == defs.NOTE4) {
        var r = get_random_int(3)
        if (r == 0) {
            var note1 = {
                "s": note.s,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8
            }
            var note2 = {
                "s": note.s + defs.NOTE8,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8
            }
            return [note1, note2]
        }
        if (r == 1) {
            var note1 = {
                "s": note.s,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8d
            }
            var note2 = {
                "s": note.s + defs.NOTE8d,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE16
            }
            return [note1, note2]
        }
        else {
            var note1 = {
                "s": note.s,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE16
            }
            var note2 = {
                "s": note.s + defs.NOTE16,
                "v": note.v,
                "p": note.p,
                "d": defs.NOTE8d
            }
            return [note1, note2]
        }
    }

    return [note]
}


function variation_split(pattern) {
    if (pattern.notes.length == 0) {
        post("[variation_split] no notes in pattern; nothing to change\n")
        return pattern
    }

    var new_notes = []
    for (var i = 0; i < pattern.notes.length; i++) {
        var r = get_random_int(100)
        if (r < _cfg.variability["split"]) {
            post("[variation_split] splitting note " + i + "\n")
            var split_notes = split_note(pattern.notes[i])
            for(j = 0; j < split_notes.length; j++) {
                new_notes.push(split_notes[j])
            }
        }
        else {
            new_notes.push(pattern.notes[i])
        }
    }

    pattern.notes = new_notes

    return pattern
}

function create_variation(pattern)  {
    var pattern_new = copy_pattern(pattern)

    pattern_new = variation_add(pattern_new)
    pattern_new = variation_split(pattern_new)
    pattern_new = variation_delete(pattern_new)
    pattern_new = variation_pitch(pattern_new)

    return pattern_new
}


function generate_phrase(num_bars) {

    var pattern = {
        duration: 4 * num_bars,
        notes: []
    }

    var r
    var target = 0
    var note_duration = defs.NOTE16
    for (var t = 0; t < pattern.duration; t += note_duration) {
        note_duration = defs.NOTE16
        var r = get_random_int(100)

        if(is_bouncy(t)) {
            target = Math.floor(_cfg.density * _cfg.bounce / 100)
            post("[generate_phrase] t=" + t + ", bouncy note; density = " + _cfg.density + ", bounce = " + _cfg.bounce + ", target=" + target + "\n")
            /*
            if (r < 100 - _cfg.bounce) {
                post("[generate_phrase] t=" + t + ", bouncy note rejected\n")
                continue
            }
                */
        }
        else {
            target = Math.floor(_cfg.density * (100 - _cfg.bounce) / 100)
            post("[generate_phrase] t=" + t + ", non-bouncy note; density = " + _cfg.density + ", bounce = " + _cfg.bounce + ", target=" + target + "\n")
            /*
            if (r < _cfg.bounce) {
                post("[generate_phrase] t=" + t + ", non-bouncy note rejected\n")
                continue
            }
                */
        }

        /*
        r = get_random_int(100)
        if(r > _cfg.density) {
            post("[generate_phrase] t=" + t + ", non-bouncy note rejected\n")
            continue
        }
            */
        
        if (r > target) {
            post("[generate_phrase] t=" + t + ", note rejected\n")
            continue
        }

        // make these probabilities adjustable?
        r = get_random_int(100)
        if (r < 40) {
            post("[generate_phrase] t=" + t + ", adding 16th note\n")
            note_duration = defs.NOTE16
        } else if (r < 65) {
            post("[generate_phrase] t=" + t + ", adding 8th note\n")
            note_duration = defs.NOTE8
        } else if (r < 85) {
            post("[generate_phrase] t=" + t + ", adding dotted 8th note\n")
            note_duration = defs.NOTE8 + defs.NOTE16
        } else {
            post("[generate_phrase] t=" + t + ", adding quarter note\n")
            note_duration = defs.NOTE4
        }

        // TODO: randomly stretch some notes to get glides

        pattern.notes.push({
            s: t,
            d: note_duration,
            v: 127,
            p: select_random_pitch(),
        })
    }

    return pattern
}

function select_random_pitch() {
    var r = Math.random()

    var total = 0;
    for (var i = 0; i < _note_probabilities.length; i++) {
        total += _note_probabilities[i]

        if (total >= r) {
            return _selected_notes[i]
        }
    }

    // just in case
    return _selected_notes[0]
}

function convert_pattern_to_note_list(pattern) {
    var notes = []
    for (var t = 0; t < defs.LOOP_LEN; t += pattern.duration) {
        for(var i = 0; i < pattern.notes.length; i++) {
            var note = {
                pitch: pattern.notes[i].p,
                start_time: t + pattern.notes[i].s,
                velocity: pattern.notes[i].v,
                duration: pattern.notes[i].d
            }
            notes.push(note)
        }
    }

    return notes
}

function copy_pattern (p) {
    var pnew = {
        duration: p.duration,
        notes: []
    }

    for (var i = 0; i < p.notes.length; i++) {
        pnew.notes.push({
            s: p.notes[i].s,
            d: p.notes[i].d,
            p: p.notes[i].p,
            v: p.notes[i].v
        })
    }

    return pnew
}

function shuffle_array(array) {
    new_array = []
    for (var i = 0; i < array.length; i++) {
        new_array.push(array[i])
    }

    for (var i = new_array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = new_array[i];
        new_array[i] = new_array[j];
        new_array[j] = temp;
    }

    return new_array
}

function generate_phrase_alg2(bars) {
    if (bars == 1) {
        note_collections = [
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4, defs.NOTE16],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE16],
        ]
    } else {
        note_collections = [
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4, defs.NOTE16, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4, defs.NOTE16],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE4, defs.NOTE16, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE16],
            [defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE16, defs.NOTE8d, defs.NOTE8d, defs.NOTE8d, defs.NOTE8, defs.NOTE8, defs.NOTE16],
        ]
    }

    r = get_random_int(note_collections.length)
    durations = shuffle_array(note_collections[r])

    post("[generate_phrase_alg2] selected " + bars + " bar pattern " + r + "\n")

    var pattern = {
        duration: bars * 4,
        notes: []
    }

    var t = 0
    for (var i = 0; i < durations.length; i++) {
        pattern.notes.push({
            s: t,
            d: durations[i],
            v: 127,
            p: select_random_pitch(),
        })
        t += durations[i]
    }

    return pattern
}

exports.generate = function (cfg, selected_notes, note_probabilities) {

    post("[generate] -------------------------------------------------------------------\n")
    post("[generate] version 050\n")
    post("[generate] -------------------------------------------------------------------\n")

    _cfg = cfg
    _selected_notes = selected_notes
    _note_probabilities = note_probabilities

    post("[generate] - density: " + _cfg.density + "\n")
    post("[generate] - bounce: " + _cfg.bounce + "\n")

    var r0 = get_random_int(2) 

    var p1
    var p2
    var pattern = null
    if (r0 == 0) {
        post("[generate] using 1-bar patterns...\n")
        var r1 = get_random_int(10) 

        if (r1 == 0) {
            post("[generate] p1 = preset(), p2 = variation(p1)...\n")
            p1 = select_preset_pattern()
            p2 = create_variation(p1)
        }
        else if (r1 == 1) {
            post("[generate] p1 = preset(), p2 = preset()...\n")
            p1 = select_preset_pattern()
            p2 = select_preset_pattern()
        }
        else if (r1 == 2) {
            post("[generate] p1 = variation(preset()), p2 = preset()...\n")
            p1 = create_variation(select_preset_pattern())
            p2 = select_preset_pattern()
        }
        else if (r1 == 3) {
            post("[generate] p1 = preset(), p2 = variation(preset())...\n")
            p1 = select_preset_pattern()
            p2 = create_variation(select_preset_pattern())
        }
        else if (r1 == 4) {
            post("[generate] p1 = variation(preset()), p2 = variation(preset())...\n")
            p1 = create_variation(select_preset_pattern())
            p2 = create_variation(select_preset_pattern())
        }
        else {
            var r2 = get_random_int(2)
            if (r2 == 0) {
                post("[generate] p1 = random(), p2 = random()...\n")
                p1 = generate_phrase_alg2(1)
                p2 = generate_phrase_alg2(1)
            } else {
                post("[generate] p1 = random(), p2 = variation(p1)...\n")
                p1 = generate_phrase_alg2(1)
                p2 = create_variation(p1)
            }
        }

        var r3 = get_random_int(19)

        if (r3 < 1) {
            post("[generate] assembling 1-bar patterns: 1-1-1-1-1-1-1-1\n")
            pattern = concat_patterns([p1, p1, p1, p1, p1, p1, p1, p1])
        }
        else if (r3 < 3) {
            post("[generate] assembling 1-bar patterns: 1-1-1-1-1-1-1-2\n")
            pattern = concat_patterns([p1, p1, p1, p1, p1, p1, p1, p2])
        }
        else if (r3 < 7) {
            post("[generate] assembling 1-bar patterns: 1-1-1-2-1-1-1-2\n")
            pattern = concat_patterns([p1, p1, p1, p2, p1, p1, p1, p2])
        }
        else if (r3 < 11) {
            post("[generate] assembling 1-bar patterns: 1-1-2-1-1-1-2-1\n")
            pattern = concat_patterns([p1, p1, p2, p1, p1, p1, p2, p1])
        }
        else {
            post("[generate] assembling 1-bar patterns: 1-2-1-2-1-2-1-2\n")
            pattern = concat_patterns([p1, p2, p1, p2, p1, p2, p1, p2])
        }
    } else {
        // TODO: should we have p1 = create_variation(random()), p2 = create_variation(p1) ?
        post("[generate] using 2-bar patterns...\n")

        var r2 = get_random_int(3)
        if (r == 0) {
            post("[generate] p1 = random(), p2 = random()...\n")
            p1 = generate_phrase_alg2(2)
            p2 = generate_phrase_alg2(2)
        } else {
            post("[generate] p1 = random(), p2 = variation(p1)...\n")
            p1 = generate_phrase_alg2(2)
            p2 = create_variation(p1)
        }

        var r3 = get_random_int(7)

        if (r3 < 1) {
            post("[generate] assembling 2-bar patterns: 1-1-1-1\n")
            pattern = concat_patterns([p1, p1, p1, p1])
        }
        else if (r3 < 3) {
            post("[generate] assembling 2-bar patterns: 1-1-1-2\n")
            pattern = concat_patterns([p1, p1, p1, p2])
        }
        else {
            post("[generate] assembling 2-bar patterns: 1-2-1-2\n")
            pattern = concat_patterns([p1, p2, p1, p2])
        }
    }

    _notes = convert_pattern_to_note_list(pattern)
    /*
    for (var i = 0; i < _notes.length; i++) {
        post("[generate] _notes[" + i + "]: pitch=" + _notes[i].pitch + ", start_time=" + _notes[i].start_time + "\n")
    }
        */
    return _notes
}
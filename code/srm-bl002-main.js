autowatch = 1
outlets = 2
outlets = 3

post("[SRM-BL002] loading...\n")

var { generate } = require('srm-bl002-generator.js')
var { js_to_dict, dict_to_js, debounce } = require('srm-bl002-utilities.js')

var _context = {}

var _cfg = {
    density: 35,
    bounce: 75,
    variability: {
        "add": 10,
        "delete": 10,
        "split": 10,
        "pitch": 10,
    },
    notelist: [],
}

var _selected_notes = []
var _note_probabilities = []
var _mousedown_in_pnote = false

function set_context(dummy, dictName) {
    post("[set_context]\n")
    _context = dict_to_js(dictName)
}

function change() {
    if (ready) {
        outlet(1, 'bang')
    }
}

function initialize() {
    post("[initialize] initializing...")
}

function set_density(density) {
    post("[set_density] setting density to " + density + "\n")
    _cfg.density = density
    send_bang()
}

function set_bounce(bounce) {
    post("[set_bounce] setting bounce to " + bounce + "\n")
    _cfg.bounce = bounce
    send_bang()
}

function set_var_add(v) {
    post("[set_var_add] setting variability['add'] to " + v + "\n")
    _cfg.variability["add"] = v
    send_bang()
}

function set_var_split(v) {
    post("[set_var_split] setting variability['split'] to " + v + "\n")
    _cfg.variability["split"] = v
    send_bang()
}

function set_var_delete(v) {
    post("[set_var_delete] setting variability['delete'] to " + v + "\n")
    _cfg.variability["delete"] = v
    send_bang()
}

function set_var_pitch(v) {
    post("[set_var_pitch] setting variability['pitch'] to " + v + "\n")
    _cfg.variability["pitch"] = v
    send_bang()
}

function mouseup() {
    post("[mouseup] _mousedown_in_pnote = " + _mousedown_in_pnote + "\n")
    if (_mousedown_in_pnote) {
        update_note_probabilities()
    }
    _mousedown_in_pnote = false
}

function mousedown_pnote() {
    _mousedown_in_pnote = true
    post("[mousedown_pnote] _mousedown_in_pnote = " + _mousedown_in_pnote + "\n")
}

function normalize_probabilities() {
    var total_probabilities = 0
    for (var i = 0; i < _note_probabilities.length; i++) {
        total_probabilities += _note_probabilities[i]
    }
    for (var i = 0; i < _note_probabilities.length; i++) {
        _note_probabilities[i] /= total_probabilities
        post("[normalize_probabilities] p(" + i + ") = " + _note_probabilities[i] + "\n")
    }
}

function update_note_probabilities() {
    post("[update_note_probabilities] resetting note probabilities...\n")
    _note_probabilities = []
    trigger_note_probability()
}

function trigger_note_probability() {
    if (_note_probabilities.length >= _selected_notes.length) {
        post("[trigger_note_probability] all note probabilities computed; not sending value to outlet\n")
        normalize_probabilities()
        return
    }

    var x_val = _note_probabilities.length / (_selected_notes.length - 1)
    post("[trigger_note_probability] sending " + x_val + " to outlet 2\n")
    outlet(2, 'float', x_val)
}

function set_note_probability(p) {
    if (_note_probabilities.length >= _selected_notes.length) {
        // the first time you select a note, the set_note_probability() function gets called dozens of
        // times for no apparent reason.
        //post("[set_note_probability] all note probabilities received; this call should not be happening!\n")
        return
    }
    post("[set_note_probability] " + p + "\n")
    post("[set_note_probability] _selected_notes.length = " + _selected_notes.length + "\n")
    _note_probabilities.push(p)

    trigger_note_probability()
}

function add_note(note) {
    post("[add_note] adding note " + note + "\n")
    _selected_notes.push(note)
    update_note_probabilities()
}

function remove_note(note) {
    post("[remove_note] removing note " + note + "\n")

    var index = _selected_notes.indexOf(note);
    if (index == -1) {
        post("[remove_note] note " + note + " not found; bailing\n")
        return
    }

    post("[remove_note] found note " + note + " at index = " + index + "\n")
    _selected_notes.splice(index, 1)
    post("[remove_note] num selected notes: " + _selected_notes.length + "\n")
    if (_selected_notes.length > 0) {
        update_note_probabilities()
    }
}

function clear_notes() {
    post("[clear_notes] clearing notes\n")
    _selected_notes = []
}

function bang() {
    var outputDictionary = {
        notes: []
    }

    if (_selected_notes.length == 0) {
        // TODO -- give the user some feedback here!
        post("no selected notes; not generating anything\n")
        outlet(0, 'dictionary', js_to_dict(outputDictionary).name)
        return
    }

    post("generating notes...\n")

    var notes = generate(_cfg, _selected_notes, _note_probabilities)

    post("clipping notes to selected range...\n")

    clipped_notes = []
    for (i = 0; i < notes.length; i++) {
        var note = notes[i]
        //post("Comparing start time (" + note.start_time + ") against clip selection start/stop (" + _context.clip.time_selection_start + "/" + _context.clip.time_selection_end + ")\n")
        if(note.start_time >= _context.clip.time_selection_start && note.start_time < _context.clip.time_selection_end) {
            //post("CLIPPED NOTE " + notes[i].pitch + " " + notes[i].start_time + "\n")
            clipped_notes.push(note)
        }
    }

    outputDictionary.notes = clipped_notes

    post("outputting dictionary...\n")

    outlet(0, 'dictionary', js_to_dict(outputDictionary).name)
}

function _send_bang() {
    post("[send_bang] sending bang...\n")
    outlet(1, 'bang')
}

var send_bang = debounce(_send_bang, 50)
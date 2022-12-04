<script>
    export let value, field

    import Label from "./Label.svelte";

    let _value, _error

    const validateValue = ()=>{
        _error = false
        if(!_value) return value = "VALUE_NOT_SET"

        if(!field.validator) return value = _value
        
        let { error, sanitized } = field.validator(_value)
        if(error){
            value = "VALUE_NOT_SET"
            return _error = error
        }

        return value = sanitized || _value
    }

    $: _value, validateValue()
    $: _value = value
</script>

<Label label={field.label}>
    <input class:error={_error} bind:value={_value}>
    <div class="error_message">{_error}</div>
</Label>

<style>
    .error_message {
        display: none;
        font-size: .8rem;
        margin-top: .35rem;
        color: rgb(202, 28, 28);
    }

    .error {
        border-color: rgb(202, 28, 28);
        outline-color: rgb(202, 28, 28);
    }

    .error + .error_message {
        display: block
    }
</style>
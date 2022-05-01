<script>
    export let value, validator

    let _value, _error

    const validateValue = ()=>{
        _error = false
        if(!_value) return value = false

        if(!validator) return value = _value
        
        let { error, sanitized } = validator(_value)
        if(error){
            value = false
            return _error = error
        }

        return value = sanitized || _value
    }

    $: _value, validateValue()
</script>

<input class:error={_error} bind:value={_value}>
<div class="error_message">{_error}</div>

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
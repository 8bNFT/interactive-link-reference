<script>
    export let field, value

    import Label from "./Label.svelte"

    value = field.options[0].value
</script>

<Label label={field.label}>
    <select bind:value>
        {#each field.options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
</Label>
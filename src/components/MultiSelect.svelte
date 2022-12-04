<script>
    export let field, payload

    import InlineLabel from "./InlineLabel.svelte";
    import Label from "./Label.svelte";

    const internal_payload = {}

    $: payload = Object.entries(internal_payload).flatMap(([k, v]) => v ? k : [])
</script>

<Label click={false} label={field.label}>
    {#each field.options as option}
        <InlineLabel small={true} label={option.label}>
            <input type="checkbox" bind:checked={internal_payload[option.value || option.label]}>
        </InlineLabel>
    {/each}
</Label>
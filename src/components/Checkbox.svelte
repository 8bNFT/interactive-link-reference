<script>
    export let field, value

    import InlineLabel from "./InlineLabel.svelte";
</script>

<InlineLabel label={field.label}>
    <input type="checkbox" bind:checked={value}>
</InlineLabel>